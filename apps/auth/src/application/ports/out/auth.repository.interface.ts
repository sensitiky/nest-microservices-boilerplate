import { Auth } from '../../../domain/entities/auth.entity';

export interface IAuthRepository {
  findById(id: string): Promise<Auth>;
  findByUserId(userId: string): Promise<Auth>;
  create(auth: Auth): Promise<Auth>;
  update(id: string, auth: Partial<Auth>): Promise<Auth>;
  delete(id: string): Promise<void>;
}
