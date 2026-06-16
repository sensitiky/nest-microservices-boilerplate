import { UserNotFoundException } from '../../../domain/exceptions/user-not-found.exception';
import { IUserRepository } from '../../../domain/ports/out/user.repository.port';

export class DeleteUserUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new UserNotFoundException(id);
    await this.userRepo.delete(id);
  }
}
