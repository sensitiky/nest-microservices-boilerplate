import {
  CanActivate,
  ConsoleLogger,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new ConsoleLogger();
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = await this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('No authorization token provided');
    }
    try {
      const decodedToken = await this.extractTokenFromHeader(request);
      request['user'] = decodedToken;
    } catch (e) {
      this.logger.error('Token verification failed:', e.message);
      throw new UnauthorizedException('Invalid authorization token');
    }
    return true;
  }

  private async extractTokenFromHeader(request: FastifyRequest): Promise<any> {
    const token = request.headers.authorization?.replace('Bearer ', '');
    const payload = await this.jwtService.decode(token);
    return payload;
  }
}
