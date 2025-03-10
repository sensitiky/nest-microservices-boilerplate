import { User } from '../entities/user.entity';

export interface IUserService {
  getAllUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User>;
  getUserByEmail(email: string): Promise<User>;
  createUser(user: User): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<void>;
  getMe(token: string): Promise<Partial<User>>;
}
