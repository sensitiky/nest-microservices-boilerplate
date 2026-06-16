import { User } from '../../../domain/aggregates/user.aggregate';
import { Email } from '../../../domain/value-objects/email.vo';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found.exception';
import { IUserRepository } from '../../../domain/ports/out/user.repository.port';

export class GetUserByEmailUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(email: string): Promise<User> {
    const user = await this.userRepo.findByEmail(Email.create(email));
    if (!user) throw new UserNotFoundException(email);
    return user;
  }
}
