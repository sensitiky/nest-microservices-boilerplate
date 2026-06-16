import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { GetUserByIdUseCase } from './get-user-by-id.use-case';
import { IUserRepository } from '../../../domain/ports/out/user.repository.port';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found.exception';
import { User } from '../../../domain/aggregates/user.aggregate';

describe('GetUserByIdUseCase', () => {
  let useCase: GetUserByIdUseCase;
  let mockRepo: IUserRepository;

  beforeEach(() => {
    mockRepo = {
      findById: mock(async () => null),
      findByEmail: mock(async () => null),
      findAll: mock(async () => []),
      save: mock(async () => undefined),
      delete: mock(async () => undefined),
    };
    useCase = new GetUserByIdUseCase(mockRepo);
  });

  it('returns user when found', async () => {
    const user = await User.create({ name: 'Alice', email: 'alice@example.com', password: 'p' });
    mockRepo.findById = mock(async () => user);
    const result = await useCase.execute('some-id');
    expect(result).toBe(user);
  });

  it('throws UserNotFoundException when not found', async () => {
    await expect(useCase.execute('missing')).rejects.toThrow(UserNotFoundException);
  });
});
