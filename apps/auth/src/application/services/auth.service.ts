import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Auth } from '../../domain/entities/auth.entity';
import { IAuthRepository } from '../../domain/repositories/auth.repository.interface';
import {
  IAuthExecuter,
  IAuthRegister,
  IAuthTokenizer,
} from '../../domain/services/auth.service.interface';
import * as bcrypt from 'bcryptjs';
import { catchError, firstValueFrom, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto, RegisterDto } from '@api/common';

@Injectable()
export class AuthService
  implements
    IAuthExecuter<Auth, LoginDto>,
    IAuthRegister<Auth, RegisterDto>,
    IAuthTokenizer<string, boolean | Auth>
{
  constructor(
    @Inject('IAuthRepository')
    private readonly authRepository: IAuthRepository,
    @Inject('USER_SERVICE')
    private readonly userRepository: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async login(credentials: LoginDto): Promise<Auth> {
    const user = await firstValueFrom(
      this.userRepository.send('get-user-by-email', credentials.email),
    );
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

  async register(userData: RegisterDto): Promise<Auth> {
    try {
      const existingUser = await firstValueFrom(
        this.userRepository
          .send('get-user-by-email', userData.email)
          .pipe(catchError(() => of(null))),
      );
      if (existingUser) {
        throw new Error('User already exists');
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await firstValueFrom(
        this.userRepository
          .send('create-user', {
            id: uuidv4(),
            createdAt: new Date(),
            updatedAt: new Date(),
            email: userData.email,
            password: hashedPassword,
            name: userData.name,
          })
          .pipe(catchError(() => of(null))),
      );

      return this.generateTokens(user.id);
    } catch (e) {
      console.error(e);
    }
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      return decoded;
    } catch {
      return false;
    }
  }

  async refreshToken(refreshToken: string): Promise<Auth> {
    try {
      const decoded = this.jwtService.verify(refreshToken);
      const auth = await this.authRepository.findByUserId(decoded.userId);

      if (auth.refreshToken !== refreshToken) {
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
