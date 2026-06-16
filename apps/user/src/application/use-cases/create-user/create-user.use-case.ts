import { UserSnapshot } from '@api/common';
import { User } from '../../../domain/aggregates/user.aggregate';
import { Email } from '../../../domain/value-objects/email.vo';
import { UserAlreadyExistsException } from '../../../domain/exceptions/user-already-exists.exception';
import { IUserRepository } from '../../../domain/ports/out/user.repository.port';
import { CreateUserCommand } from './create-user.command';

export class CreateUserUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(command: CreateUserCommand): Promise<UserSnapshot> {
    const existing = await this.userRepo.findByEmail(Email.create(command.email));
    if (existing) throw new UserAlreadyExistsException(command.email);
    const user = await User.create(command);
    await this.userRepo.save(user);
    return user.toSnapshot();
  }
}
