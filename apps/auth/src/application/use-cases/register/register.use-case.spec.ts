import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { RegisterUseCase } from './register.use-case';
import { IAuthSessionRepository } from '../../../domain/ports/out/auth-session.repository.port';
import { IUserServiceClient } from '../../../domain/ports/out/user-service-client.port';
import { ITokenGenerator } from '../../../domain/ports/out/token-generator.port';
import { UserAlreadyExistsException } from '../../../domain/exceptions/user-already-exists.exception';
import { UserSnapshot } from '@api/common';

describe('RegisterUseCase', () => {
  let useCase: RegisterUseCase;
  let mockAuthRepo: IAuthSessionRepository;
  let mockUserClient: IUserServiceClient;
  let mockTokenGenerator: ITokenGenerator;

  const newUserSnapshot: UserSnapshot = {
    id: 'user-2',
    name: 'Bob',
    email: 'bob@example.com',
    hashedPassword: '$2b$10$hash',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockAuthRepo = {
      findById: mock(async () => null),
      findByUserId: mock(async () => null),
      save: mock(async () => undefined),
      delete: mock(async () => undefined),
    };

    mockUserClient = {
      findByEmail: mock(async () => null),
      create: mock(async () => newUserSnapshot),
    };

    mockTokenGenerator = {
      generateAccessToken: mock(() => 'access-token'),
      generateRefreshToken: mock(() => 'refresh-token'),
      verifyToken: mock(() => true),
      decodeToken: mock(() => ({ userId: 'user-2' })),
    };

    useCase = new RegisterUseCase(
      mockAuthRepo,
      mockUserClient,
      mockTokenGenerator,
    );
  });

  it('creates user and returns auth session', async () => {
    const session = await useCase.execute({
      name: 'Bob',
      email: 'bob@example.com',
      password: 'pass123',
    });
    expect(session.userId).toBe('user-2');
    expect(session.accessToken).toBe('access-token');
    expect(mockUserClient.create).toHaveBeenCalledTimes(1);
    expect(mockAuthRepo.save).toHaveBeenCalledTimes(1);
  });

  it('throws UserAlreadyExistsException when email is taken', async () => {
    mockUserClient.findByEmail = mock(async () => newUserSnapshot);
    await expect(
      useCase.execute({
        name: 'Bob',
        email: 'bob@example.com',
        password: 'pass',
      }),
    ).rejects.toThrow(UserAlreadyExistsException);
    expect(mockUserClient.create).not.toHaveBeenCalled();
  });
});
