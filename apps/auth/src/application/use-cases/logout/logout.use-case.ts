import { IAuthSessionRepository } from '../../../domain/ports/out/auth-session.repository.port';

export class LogoutUseCase {
  constructor(private readonly authSessionRepo: IAuthSessionRepository) {}

  async execute(userId: string): Promise<void> {
    const session = await this.authSessionRepo.findByUserId(userId);
    if (session) {
      await this.authSessionRepo.delete(session.id);
    }
  }
}
