import { AuthSessionSnapshot } from '@api/common';

export interface CreateAuthSessionProps {
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export class AuthSession {
  private constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private _accessToken: string,
    private _refreshToken: string,
    private _expiresAt: Date,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
  ) {}

  static create(props: CreateAuthSessionProps): AuthSession {
    return new AuthSession(
      crypto.randomUUID(),
      props.userId,
      props.accessToken,
      props.refreshToken,
      props.expiresAt,
      new Date(),
      new Date(),
    );
  }

  static reconstitute(snapshot: AuthSessionSnapshot): AuthSession {
    return new AuthSession(
      snapshot.id,
      snapshot.userId,
      snapshot.accessToken,
      snapshot.refreshToken,
      snapshot.expiresAt,
      snapshot.createdAt,
      snapshot.updatedAt,
    );
  }

  refresh(accessToken: string, refreshToken: string, expiresAt: Date): void {
    this._accessToken = accessToken;
    this._refreshToken = refreshToken;
    this._expiresAt = expiresAt;
    this._updatedAt = new Date();
  }

  toSnapshot(): AuthSessionSnapshot {
    return {
      id: this._id,
      userId: this._userId,
      accessToken: this._accessToken,
      refreshToken: this._refreshToken,
      expiresAt: this._expiresAt,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  get id(): string {
    return this._id;
  }
  get userId(): string {
    return this._userId;
  }
  get accessToken(): string {
    return this._accessToken;
  }
  get refreshToken(): string {
    return this._refreshToken;
  }
  get expiresAt(): Date {
    return this._expiresAt;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }
}
