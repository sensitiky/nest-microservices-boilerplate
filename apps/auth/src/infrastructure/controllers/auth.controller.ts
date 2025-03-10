import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from '../../application/services/auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
