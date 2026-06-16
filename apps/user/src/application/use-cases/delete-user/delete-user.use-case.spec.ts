import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { DeleteUserUseCase } from './delete-user.use-case';
import { IUserRepository } from '../../../domain/ports/out/user.repository.port';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found.exception';
import { User } from '../../../domain/aggregates/user.aggregate';

describe('DeleteUserUseCase', () => {
  let useCase: DeleteUserUseCase;
  let mockRepo: IUserRepository;

  beforeEach(() => {
    mockRepo = {
      findById: mock(async () => null),
      findByEmail: mock(async () => null),
      findAll: mock(async () => []),
      save: mock(async () => undefined),
      delete: mock(async () => undefined),
    };
    useCase = new DeleteUserUseCase(mockRepo);
  });

  it('deletes user when found', async () => {
    const user = await User.create({ name: 'Alice', email: 'alice@example.com', password: 'p' });
    mockRepo.findById = mock(async () => user);
    await useCase.execute(user.id);
    expect(mockRepo.delete).toHaveBeenCalledWith(user.id);
  });

  it('throws UserNotFoundException when not found', async () => {
    await expect(useCase.execute('missing')).rejects.toThrow(UserNotFoundException);
    expect(mockRepo.delete).not.toHaveBeenCalled();
  });
});
