import { describe, it, expect } from 'bun:test';
import { User } from './user.aggregate';
import { InvalidEmailException } from '../exceptions/invalid-email.exception';

describe('User aggregate', () => {
  it('creates user with hashed password and emits UserCreatedEvent', async () => {
    const user = await User.create({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'pass123',
    });
    expect(user.id).toBeTruthy();
    expect(user.email.value).toBe('alice@example.com');
    expect(user.name).toBe('Alice');
    expect(user.password.value).not.toBe('pass123');
    const events = user.pullDomainEvents();
    expect(events).toHaveLength(1);
    expect((events[0] as any).name).toBe('UserCreatedEvent');
  });

  it('throws InvalidEmailException for invalid email', async () => {
    await expect(
      User.create({ name: 'Alice', email: 'bad', password: 'pass' }),
    ).rejects.toThrow(InvalidEmailException);
  });

  it('updates name and avatar', async () => {
    const user = await User.create({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'pass123',
    });
    user.update({ name: 'Bob', avatar: 'http://img.com/a.jpg' });
    expect(user.name).toBe('Bob');
    expect(user.avatar).toBe('http://img.com/a.jpg');
  });

  it('reconstitutes from snapshot without emitting events', () => {
    const now = new Date();
    const user = User.reconstitute({
      id: 'abc',
      name: 'Alice',
      email: 'alice@example.com',
      hashedPassword: '$2b$10$hash',
      avatar: undefined,
      createdAt: now,
      updatedAt: now,
    });
    expect(user.id).toBe('abc');
    expect(user.pullDomainEvents()).toHaveLength(0);
  });

  it('toSafeSnapshot excludes password', async () => {
    const user = await User.create({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'pass123',
    });
    const snap = user.toSafeSnapshot();
    expect('hashedPassword' in snap).toBe(false);
    expect(snap.email).toBe('alice@example.com');
  });
});
