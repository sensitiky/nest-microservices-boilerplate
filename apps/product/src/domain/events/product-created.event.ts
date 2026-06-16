export class ProductCreatedEvent {
  readonly name = 'ProductCreatedEvent';
  readonly occurredAt = new Date();

  constructor(
    readonly productId: string,
    readonly productName: string,
  ) {}
}
