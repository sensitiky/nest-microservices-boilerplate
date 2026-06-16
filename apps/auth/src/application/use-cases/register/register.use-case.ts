import { AuthSession } from '../../../domain/aggregates/auth-session.aggregate';
import { UserAlreadyExistsException } from '../../../domain/exceptions/user-already-exists.exception';
import { IAuthSessionRepository } from '../../../domain/ports/out/auth-session.repository.port';
import { IUserServiceClient } from '../../../domain/ports/out/user-service-client.port';
import { ITokenGenerator } from '../../../domain/ports/out/token-generator.port';
import { RegisterCommand } from './register.command';

export class RegisterUseCase {
  constructor(
    private readonly authSessionRepo: IAuthSessionRepository,
    private readonly userClient: IUserServiceClient,
    private readonly tokenGenerator: ITokenGenerator,
  ) {}

  async execute(command: RegisterCommand): Promise<AuthSession> {
    const existing = await this.userClient.findByEmail(command.email);
    if (existing) throw new UserAlreadyExistsException(command.email);

    const userSnapshot = await this.userClient.create({
      name: command.name,
      email: command.email,
      password: command.password,
    });

    const accessToken = this.tokenGenerator.generateAccessToken(userSnapshot.id);
    const refreshToken = this.tokenGenerator.generateRefreshToken(userSnapshot.id);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    const session = AuthSession.create({ userId: userSnapshot.id, accessToken, refreshToken, expiresAt });
    await this.authSessionRepo.save(session);
    return session;
  }
}
