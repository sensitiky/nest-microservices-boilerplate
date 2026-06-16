import { SafeUserSnapshot } from '@api/common';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found.exception';
import { IUserRepository } from '../../../domain/ports/out/user.repository.port';

export class GetMeUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(userId: string): Promise<SafeUserSnapshot> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new UserNotFoundException(userId);
    return user.toSafeSnapshot();
  }
}
