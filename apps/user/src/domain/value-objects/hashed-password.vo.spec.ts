import { describe, it, expect } from 'bun:test';
import { HashedPassword } from './hashed-password.vo';

describe('HashedPassword', () => {
  it('hashes a raw password', async () => {
    const hp = await HashedPassword.fromRaw('secret123');
    expect(hp.value).not.toBe('secret123');
    expect(hp.value.startsWith('$2')).toBe(true);
  });

  it('compare returns true for correct password', async () => {
    const hp = await HashedPassword.fromRaw('secret123');
    expect(await hp.compare('secret123')).toBe(true);
  });

  it('compare returns false for wrong password', async () => {
    const hp = await HashedPassword.fromRaw('secret123');
    expect(await hp.compare('wrong')).toBe(false);
  });

  it('fromHash wraps existing hash without re-hashing', () => {
    const hash = '$2b$10$fakehash';
    const hp = HashedPassword.fromHash(hash);
    expect(hp.value).toBe(hash);
  });
});
