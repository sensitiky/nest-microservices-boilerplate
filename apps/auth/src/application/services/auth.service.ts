import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Auth } from '../../domain/entities/auth.entity';
import { IAuthRepository } from '../../domain/repositories/auth.repository.interface';
import { IAuthService } from '../../domain/services/auth.service.interface';
import * as bcrypt from 'bcryptjs';
import { IUserRepository } from 'apps/user/src/domain/repositories/user.repository.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject('IAuthRepository')
    private readonly authRepository: IAuthRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(credentials: { email: string; password: string }): Promise<Auth> {
    const user = await this.userRepository.findByEmail(credentials.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user.id);
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
  }): Promise<Auth> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.userRepository.create({
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
    });

    return this.generateTokens(user.id);
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const decoded = this.jwtService.verify(token);
      return !!decoded;
    } catch {
      return false;
    }
  }

  async refreshToken(refreshToken: string): Promise<Auth> {
    try {
      const decoded = this.jwtService.verify(refreshToken);
      const auth = await this.authRepository.findByUserId(decoded.userId);

      if (!auth || auth.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokens(decoded.userId);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string): Promise<void> {
    const auth = await this.authRepository.findByUserId(userId);
    if (auth) {
      await this.authRepository.delete(auth.id);
    }
  }

  private async generateTokens(userId: string): Promise<Auth> {
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign({ userId }, { expiresIn: '7d' });

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const existingAuth = await this.authRepository.findByUserId(userId);

    if (existingAuth) {
      return await this.authRepository.update(existingAuth.id, {
        accessToken,
        refreshToken,
        expiresAt,
        updatedAt: new Date(),
      });
    }

    return await this.authRepository.create(
      new Auth({
        userId,
        accessToken,
        refreshToken,
        expiresAt,
      }),
    );
  }
}
