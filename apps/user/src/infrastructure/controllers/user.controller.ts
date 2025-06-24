import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from '../../application/services/user.service';
import { UserDomain } from '../../domain/entities/user.entity';
import { UserServiceSymbol } from '../../domain/symbols/user.symbol';
import { IUserService } from '../../application/port/in/user.service.interface';

@Controller()
export class UserController {
  constructor(
    @Inject(UserServiceSymbol)
    private readonly userService: IUserService,
  ) {}

  @MessagePattern('get-all-users')
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @MessagePattern('get-user-by-id')
  async getUserById(@Payload() id: string) {
    return await this.userService.getUserById(id);
  }

  @MessagePattern('get-user-by-email')
  async getUserByEmail(@Payload() email: string) {
    return await this.userService.getUserByEmail(email);
  }

  @MessagePattern('create-user')
  async createUser(@Payload() user: UserDomain) {
    return await this.userService.createUser(user);
  }

  @MessagePattern('update-user')
  async updateUser(
    @Payload() payload: { id: string; user: Partial<UserDomain> },
  ) {
    return await this.userService.updateUser(payload.id, payload.user);
  }

  @MessagePattern('delete-user')
  async deleteUser(@Payload() id: string) {
    return await this.userService.deleteUser(id);
  }

  @MessagePattern('me')
  async getMe(@Payload() token: string) {
    return await this.userService.getMe(token);
  }
}
