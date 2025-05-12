import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthFactoryService } from '../../application/services/auth-factory.service';
import { AuthChannel, LoginDto, RegisterDto } from '@api/common';

@Controller()
export class AuthController {
  constructor(private readonly authFactoryService: AuthFactoryService) {}

  @MessagePattern('login')
  async login(
    @Payload()
    credentials: LoginDto,
    channel: AuthChannel,
  ) {
    const builder = this.authFactoryService.get(channel);
    return builder.login(credentials);
  }

  @MessagePattern('register')
  async register(@Payload() userData: RegisterDto, channel: AuthChannel) {
    const builder = this.authFactoryService.get(channel);
    return builder.register(userData);
  }

  @MessagePattern('validate-token')
  async validateToken(@Payload() token: string, channel: AuthChannel) {
    const builder = this.authFactoryService.get(channel);
    return builder.validateToken(token);
  }

  @MessagePattern('refresh-token')
  async refreshToken(@Payload() refreshToken: string, channel: AuthChannel) {
    const builder = this.authFactoryService.get(channel);
    return builder.refreshToken(refreshToken);
  }

  @MessagePattern('logout')
  async logout(@Payload() userId: string, channel: AuthChannel) {
    const builder = this.authFactoryService.get(channel);
    return builder.logout(userId);
  }
}
