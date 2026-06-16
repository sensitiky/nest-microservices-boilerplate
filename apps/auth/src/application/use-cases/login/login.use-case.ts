import { AuthSession } from '../../../domain/aggregates/auth-session.aggregate';
import { HashedPassword } from '../../../domain/value-objects/hashed-password.vo';
import { InvalidCredentialsException } from '../../../domain/exceptions/invalid-credentials.exception';
import { IAuthSessionRepository } from '../../../domain/ports/out/auth-session.repository.port';
import { IUserServiceClient } from '../../../domain/ports/out/user-service-client.port';
import { ITokenGenerator } from '../../../domain/ports/out/token-generator.port';
import { LoginCommand } from './login.command';

export class LoginUseCase {
  constructor(
    private readonly authSessionRepo: IAuthSessionRepository,
    private readonly userClient: IUserServiceClient,
    private readonly tokenGenerator: ITokenGenerator,
  ) {}

  async execute(command: LoginCommand): Promise<AuthSession> {
    const userSnapshot = await this.userClient.findByEmail(command.email);
    if (!userSnapshot) throw new InvalidCredentialsException();

    const password = HashedPassword.fromHash(userSnapshot.hashedPassword);
    const isValid = await password.compare(command.password);
    if (!isValid) throw new InvalidCredentialsException();

    const accessToken = this.tokenGenerator.generateAccessToken(
      userSnapshot.id,
    );
    const refreshToken = this.tokenGenerator.generateRefreshToken(
      userSnapshot.id,
    );
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    const existing = await this.authSessionRepo.findByUserId(userSnapshot.id);
    if (existing) {
      existing.refresh(accessToken, refreshToken, expiresAt);
      await this.authSessionRepo.save(existing);
      return existing;
    }

    const session = AuthSession.create({
      userId: userSnapshot.id,
      accessToken,
      refreshToken,
      expiresAt,
    });
    await this.authSessionRepo.save(session);
    return session;
  }
}
