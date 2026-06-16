import { UserSnapshot, SafeUserSnapshot } from '@api/common';
import { Email } from '../value-objects/email.vo';
import { HashedPassword } from '../value-objects/hashed-password.vo';
import { UserCreatedEvent } from '../events/user-created.event';

export interface CreateUserProps {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export class User {
  private readonly _domainEvents: unknown[] = [];

  private constructor(
    private readonly _id: string,
    private _name: string,
    private readonly _email: Email,
    private _password: HashedPassword,
    private _avatar: string | undefined,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
  ) {}

  static async create(props: CreateUserProps): Promise<User> {
    const password = await HashedPassword.fromRaw(props.password);
    const user = new User(
      crypto.randomUUID(),
      props.name,
      Email.create(props.email),
      password,
      props.avatar,
      new Date(),
      new Date(),
    );
    user._domainEvents.push(new UserCreatedEvent(user._id, props.email));
    return user;
  }

  static reconstitute(snapshot: UserSnapshot): User {
    return new User(
      snapshot.id,
      snapshot.name,
      Email.fromString(snapshot.email),
      HashedPassword.fromHash(snapshot.hashedPassword),
      snapshot.avatar,
      snapshot.createdAt,
      snapshot.updatedAt,
    );
  }

  update(props: Partial<{ name: string; avatar: string }>): void {
    if (props.name !== undefined) this._name = props.name;
    if (props.avatar !== undefined) this._avatar = props.avatar;
    this._updatedAt = new Date();
  }

  async changePassword(newRawPassword: string): Promise<void> {
    this._password = await HashedPassword.fromRaw(newRawPassword);
    this._updatedAt = new Date();
  }

  toSafeSnapshot(): SafeUserSnapshot {
    return {
      id: this._id,
      name: this._name,
      email: this._email.value,
      avatar: this._avatar,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  toSnapshot(): UserSnapshot {
    return {
      id: this._id,
      name: this._name,
      email: this._email.value,
      hashedPassword: this._password.value,
      avatar: this._avatar,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  pullDomainEvents(): unknown[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }

  get id(): string {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get email(): Email {
    return this._email;
  }
  get password(): HashedPassword {
    return this._password;
  }
  get avatar(): string | undefined {
    return this._avatar;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }
}
