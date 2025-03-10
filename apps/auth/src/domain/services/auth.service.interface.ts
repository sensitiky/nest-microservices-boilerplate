import { Auth } from '../entities/auth.entity';

export interface IAuthService {
  login(credentials: { email: string; password: string }): Promise<Auth>;
  register(userData: {
    email: string;
    password: string;
    name: string;
  }): Promise<Auth>;
  validateToken(token: string): Promise<boolean>;
  refreshToken(refreshToken: string): Promise<Auth>;
  logout(userId: string): Promise<void>;
}
