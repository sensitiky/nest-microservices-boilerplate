export class UserCreatedEvent {
  readonly name = 'UserCreatedEvent';
  readonly occurredAt = new Date();

  constructor(
    readonly userId: string,
    readonly email: string,
  ) {}
}
