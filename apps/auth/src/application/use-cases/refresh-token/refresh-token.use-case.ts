import { AuthSession } from '../../../domain/aggregates/auth-session.aggregate';
import { InvalidTokenException } from '../../../domain/exceptions/invalid-token.exception';
import { IAuthSessionRepository } from '../../../domain/ports/out/auth-session.repository.port';
import { ITokenGenerator } from '../../../domain/ports/out/token-generator.port';

export class RefreshTokenUseCase {
  constructor(
    private readonly authSessionRepo: IAuthSessionRepository,
    private readonly tokenGenerator: ITokenGenerator,
  ) {}

  async execute(refreshToken: string): Promise<AuthSession> {
    if (!this.tokenGenerator.verifyToken(refreshToken)) throw new InvalidTokenException();

    const payload = this.tokenGenerator.decodeToken(refreshToken);
    if (!payload) throw new InvalidTokenException();

    const session = await this.authSessionRepo.findByUserId(payload.userId);
    if (!session || session.refreshToken !== refreshToken) throw new InvalidTokenException();

    const accessToken = this.tokenGenerator.generateAccessToken(payload.userId);
    const newRefreshToken = this.tokenGenerator.generateRefreshToken(payload.userId);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    session.refresh(accessToken, newRefreshToken, expiresAt);
    await this.authSessionRepo.save(session);
    return session;
  }
}
