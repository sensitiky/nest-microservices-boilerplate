import { AuthSession } from '../../aggregates/auth-session.aggregate';

export interface IAuthSessionRepository {
  findById(id: string): Promise<AuthSession | null>;
  findByUserId(userId: string): Promise<AuthSession | null>;
  save(session: AuthSession): Promise<void>;
  delete(id: string): Promise<void>;
}
