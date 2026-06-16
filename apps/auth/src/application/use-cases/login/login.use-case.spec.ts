import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { LoginUseCase } from './login.use-case';
import { IAuthSessionRepository } from '../../../domain/ports/out/auth-session.repository.port';
import { IUserServiceClient } from '../../../domain/ports/out/user-service-client.port';
import { ITokenGenerator } from '../../../domain/ports/out/token-generator.port';
import { InvalidCredentialsException } from '../../../domain/exceptions/invalid-credentials.exception';
import { UserSnapshot } from '@api/common';
import * as bcrypt from 'bcryptjs';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let mockAuthRepo: IAuthSessionRepository;
  let mockUserClient: IUserServiceClient;
  let mockTokenGenerator: ITokenGenerator;
  let hashedPassword: string;

  beforeEach(async () => {
    hashedPassword = await bcrypt.hash('correct-password', 10);

    const userSnapshot: UserSnapshot = {
      id: 'user-1',
      name: 'Alice',
      email: 'alice@example.com',
      hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockAuthRepo = {
      findById: mock(async () => null),
      findByUserId: mock(async () => null),
      save: mock(async () => undefined),
      delete: mock(async () => undefined),
    };

    mockUserClient = {
      findByEmail: mock(async () => userSnapshot),
      create: mock(async () => userSnapshot),
    };

    mockTokenGenerator = {
      generateAccessToken: mock(() => 'access-token'),
      generateRefreshToken: mock(() => 'refresh-token'),
      verifyToken: mock(() => true),
      decodeToken: mock(() => ({ userId: 'user-1' })),
    };

    useCase = new LoginUseCase(mockAuthRepo, mockUserClient, mockTokenGenerator);
  });

  it('returns auth session on valid credentials', async () => {
    const session = await useCase.execute({ email: 'alice@example.com', password: 'correct-password' });
    expect(session.accessToken).toBe('access-token');
    expect(session.userId).toBe('user-1');
    expect(mockAuthRepo.save).toHaveBeenCalledTimes(1);
  });

  it('throws InvalidCredentialsException when user not found', async () => {
    mockUserClient.findByEmail = mock(async () => null);
    await expect(
      useCase.execute({ email: 'nobody@example.com', password: 'pass' }),
    ).rejects.toThrow(InvalidCredentialsException);
  });

  it('throws InvalidCredentialsException when password is wrong', async () => {
    await expect(
      useCase.execute({ email: 'alice@example.com', password: 'wrong-password' }),
    ).rejects.toThrow(InvalidCredentialsException);
  });
});
