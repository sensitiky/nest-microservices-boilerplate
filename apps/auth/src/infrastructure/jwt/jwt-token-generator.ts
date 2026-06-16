import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenGenerator } from '../../domain/ports/out/token-generator.port';

@Injectable()
export class JwtTokenGenerator implements ITokenGenerator {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(userId: string): string {
    return this.jwtService.sign({ userId }, { expiresIn: '1h' });
  }

  generateRefreshToken(userId: string): string {
    return this.jwtService.sign({ userId }, { expiresIn: '7d' });
  }

  verifyToken(token: string): boolean {
    try {
      this.jwtService.verify(token);
      return true;
    } catch {
      return false;
    }
  }

  decodeToken(token: string): { userId: string } | null {
    try {
      return this.jwtService.decode(token) as { userId: string };
    } catch {
      return null;
    }
  }
}
