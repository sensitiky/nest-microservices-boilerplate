import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { UpdateUserUseCase } from './update-user.use-case';
import { IUserRepository } from '../../../domain/ports/out/user.repository.port';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found.exception';
import { User } from '../../../domain/aggregates/user.aggregate';

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase;
  let mockRepo: IUserRepository;

  beforeEach(() => {
    mockRepo = {
      findById: mock(async () => null),
      findByEmail: mock(async () => null),
      findAll: mock(async () => []),
      save: mock(async () => undefined),
      delete: mock(async () => undefined),
    };
    useCase = new UpdateUserUseCase(mockRepo);
  });

  it('updates user name and saves', async () => {
    const user = await User.create({ name: 'Alice', email: 'alice@example.com', password: 'p' });
    mockRepo.findById = mock(async () => user);
    const result = await useCase.execute({ id: user.id, name: 'Bob' });
    expect(result.name).toBe('Bob');
    expect(mockRepo.save).toHaveBeenCalledTimes(1);
  });

  it('throws UserNotFoundException when not found', async () => {
    await expect(useCase.execute({ id: 'missing', name: 'Bob' })).rejects.toThrow(UserNotFoundException);
  });
});
