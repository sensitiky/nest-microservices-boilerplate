import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IAuthService } from '../../domain/services/auth.service.interface';

@Controller()
export class AuthController {
  constructor(
    @Inject('IAuthService')
    private readonly authService: IAuthService,
  ) {}

  @MessagePattern('login')
  async login(@Payload() credentials: { email: string; password: string }) {
    return await this.authService.login(credentials);
  }

  @MessagePattern('register')
  async register(
    @Payload() userData: { email: string; password: string; name: string },
  ) {
    return await this.authService.register(userData);
  }

  @MessagePattern('validate-token')
  async validateToken(@Payload() token: string) {
    return await this.authService.validateToken(token);
  }

  @MessagePattern('refresh-token')
  async refreshToken(@Payload() refreshToken: string) {
    return await this.authService.refreshToken(refreshToken);
  }

  @MessagePattern('logout')
  async logout(@Payload() userId: string) {
    return await this.authService.logout(userId);
  }
}
