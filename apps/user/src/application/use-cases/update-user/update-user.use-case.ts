import { User } from '../../../domain/aggregates/user.aggregate';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found.exception';
import { IUserRepository } from '../../../domain/ports/out/user.repository.port';
import { UpdateUserCommand } from './update-user.command';

export class UpdateUserUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(command: UpdateUserCommand): Promise<User> {
    const user = await this.userRepo.findById(command.id);
    if (!user) throw new UserNotFoundException(command.id);
    user.update({ name: command.name, avatar: command.avatar });
    if (command.password) {
      await user.changePassword(command.password);
    }
    await this.userRepo.save(user);
    return user;
  }
}
