import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { CreateUserUseCase } from './create-user.use-case';
import { IUserRepository } from '../../../domain/ports/out/user.repository.port';
import { UserAlreadyExistsException } from '../../../domain/exceptions/user-already-exists.exception';
import { User } from '../../../domain/aggregates/user.aggregate';
import { Email } from '../../../domain/value-objects/email.vo';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockRepo: IUserRepository;

  beforeEach(() => {
    mockRepo = {
      findById: mock(async () => null),
      findByEmail: mock(async () => null),
      findAll: mock(async () => []),
      save: mock(async () => undefined),
      delete: mock(async () => undefined),
    };
    useCase = new CreateUserUseCase(mockRepo);
  });

  it('creates user when email is not taken', async () => {
    await useCase.execute({ name: 'Alice', email: 'alice@example.com', password: 'pass123' });
    expect(mockRepo.save).toHaveBeenCalledTimes(1);
  });

  it('throws UserAlreadyExistsException when email is taken', async () => {
    const existing = await User.create({ name: 'Alice', email: 'alice@example.com', password: 'p' });
    mockRepo.findByEmail = mock(async () => existing);
    await expect(
      useCase.execute({ name: 'Bob', email: 'alice@example.com', password: 'pass' }),
    ).rejects.toThrow(UserAlreadyExistsException);
    expect(mockRepo.save).not.toHaveBeenCalled();
  });
});
