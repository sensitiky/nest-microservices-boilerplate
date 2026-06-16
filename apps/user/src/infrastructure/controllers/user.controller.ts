import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserUseCase } from '../../application/use-cases/create-user/create-user.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id/get-user-by-id.use-case';
import { GetUserByEmailUseCase } from '../../application/use-cases/get-user-by-email/get-user-by-email.use-case';
import { GetAllUsersUseCase } from '../../application/use-cases/get-all-users/get-all-users.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user/update-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user/delete-user.use-case';
import { GetMeUseCase } from '../../application/use-cases/get-me/get-me.use-case';
import { CreateUserCommand } from '../../application/use-cases/create-user/create-user.command';
import { UpdateUserCommand } from '../../application/use-cases/update-user/update-user.command';

@Controller()
export class UserController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly getUserById: GetUserByIdUseCase,
    private readonly getUserByEmail: GetUserByEmailUseCase,
    private readonly getAllUsers: GetAllUsersUseCase,
    private readonly updateUser: UpdateUserUseCase,
    private readonly deleteUser: DeleteUserUseCase,
    private readonly getMe: GetMeUseCase,
  ) {}

  @MessagePattern('create-user')
  async handleCreateUser(@Payload() command: CreateUserCommand) {
    await this.createUser.execute(command);
  }

  @MessagePattern('get-user-by-id')
  async handleGetUserById(@Payload() id: string) {
    const user = await this.getUserById.execute(id);
    return user.toSnapshot();
  }

  @MessagePattern('get-user-by-email')
  async handleGetUserByEmail(@Payload() email: string) {
    const user = await this.getUserByEmail.execute(email);
    return user.toSnapshot();
  }

  @MessagePattern('get-all-users')
  async handleGetAllUsers() {
    const users = await this.getAllUsers.execute();
    return users.map((u) => u.toSafeSnapshot());
  }

  @MessagePattern('update-user')
  async handleUpdateUser(
    @Payload() payload: { id: string; user: Omit<UpdateUserCommand, 'id'> },
  ) {
    const user = await this.updateUser.execute({
      id: payload.id,
      ...payload.user,
    });
    return user.toSafeSnapshot();
  }

  @MessagePattern('delete-user')
  async handleDeleteUser(@Payload() id: string) {
    await this.deleteUser.execute(id);
  }

  @MessagePattern('me')
  async handleGetMe(@Payload() userId: string) {
    return this.getMe.execute(userId);
  }
}
