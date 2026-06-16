import { describe, it, expect } from 'bun:test';
import { AuthSession } from './auth-session.aggregate';

describe('AuthSession aggregate', () => {
  const props = {
    userId: 'user-1',
    accessToken: 'access.token.here',
    refreshToken: 'refresh.token.here',
    expiresAt: new Date(Date.now() + 3600000),
  };

  it('creates session with generated id', () => {
    const session = AuthSession.create(props);
    expect(session.id).toBeTruthy();
    expect(session.userId).toBe('user-1');
    expect(session.accessToken).toBe('access.token.here');
  });

  it('refresh updates tokens and timestamps', async () => {
    const session = AuthSession.create(props);
    const before = session.updatedAt;
    await new Promise((r) => setTimeout(r, 10));
    session.refresh(
      'new.access',
      'new.refresh',
      new Date(Date.now() + 3600000),
    );
    expect(session.accessToken).toBe('new.access');
    expect(session.refreshToken).toBe('new.refresh');
    expect(session.updatedAt.getTime()).toBeGreaterThanOrEqual(
      before.getTime(),
    );
  });

  it('reconstitutes from snapshot', () => {
    const now = new Date();
    const session = AuthSession.reconstitute({
      id: 'sess-1',
      userId: 'user-1',
      accessToken: 'at',
      refreshToken: 'rt',
      expiresAt: now,
      createdAt: now,
      updatedAt: now,
    });
    expect(session.id).toBe('sess-1');
    expect(session.userId).toBe('user-1');
  });

  it('toSnapshot returns all fields', () => {
    const session = AuthSession.create(props);
    const snap = session.toSnapshot();
    expect(snap.userId).toBe('user-1');
    expect(snap.accessToken).toBe('access.token.here');
    expect(snap.id).toBeTruthy();
  });
});
