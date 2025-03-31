import { UserDomain } from '../entities/user.entity';

export interface IUserRepository {
  findAll(): Promise<UserDomain[]>;
  findById(id: string): Promise<UserDomain>;
  findByEmail(email: string): Promise<UserDomain>;
  create(user: UserDomain): Promise<UserDomain>;
  update(id: string, user: Partial<UserDomain>): Promise<UserDomain>;
  delete(id: string): Promise<void>;
}
