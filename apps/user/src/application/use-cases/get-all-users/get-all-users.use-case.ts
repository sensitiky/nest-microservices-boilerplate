import { User } from '../../../domain/aggregates/user.aggregate';
import { IUserRepository } from '../../../domain/ports/out/user.repository.port';

export class GetAllUsersUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(): Promise<User[]> {
    return this.userRepo.findAll();
  }
}
