import { UserDomain } from '../../../domain/entities/user.entity';

export interface IUserService {
  getAllUsers(): Promise<UserDomain[]>;
  getUserById(id: string): Promise<UserDomain>;
  getUserByEmail(email: string): Promise<UserDomain>;
  createUser(user: UserDomain): Promise<UserDomain>;
  updateUser(id: string, user: Partial<UserDomain>): Promise<UserDomain>;
  deleteUser(id: string): Promise<void>;
  getMe(token: string): Promise<Partial<UserDomain>>;
}
