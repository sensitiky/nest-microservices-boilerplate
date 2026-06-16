import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginUseCase } from '../../application/use-cases/login/login.use-case';
import { RegisterUseCase } from '../../application/use-cases/register/register.use-case';
import { ValidateTokenUseCase } from '../../application/use-cases/validate-token/validate-token.use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token/refresh-token.use-case';
import { LogoutUseCase } from '../../application/use-cases/logout/logout.use-case';
import { LoginCommand } from '../../application/use-cases/login/login.command';
import { RegisterCommand } from '../../application/use-cases/register/register.command';

@Controller()
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly validateTokenUseCase: ValidateTokenUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  @MessagePattern('login')
  async handleLogin(@Payload() command: LoginCommand) {
    const session = await this.loginUseCase.execute(command);
    return session.toSnapshot();
  }

  @MessagePattern('register')
  async handleRegister(@Payload() command: RegisterCommand) {
    const session = await this.registerUseCase.execute(command);
    return session.toSnapshot();
  }

  @MessagePattern('validate-token')
  handleValidateToken(@Payload() token: string) {
    return this.validateTokenUseCase.execute(token);
  }

  @MessagePattern('refresh-token')
  async handleRefreshToken(@Payload() refreshToken: string) {
    const session = await this.refreshTokenUseCase.execute(refreshToken);
    return session.toSnapshot();
  }

  @MessagePattern('logout')
  async handleLogout(@Payload() userId: string) {
    await this.logoutUseCase.execute(userId);
  }
}
