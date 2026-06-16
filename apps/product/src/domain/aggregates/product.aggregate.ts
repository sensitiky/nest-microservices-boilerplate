import { ProductSnapshot } from '@api/common';
import { Money } from '../value-objects/money.vo';
import { StockCount } from '../value-objects/stock-count.vo';
import { ProductCreatedEvent } from '../events/product-created.event';

export interface CreateProductProps {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export class Product {
  private readonly _domainEvents: unknown[] = [];

  private constructor(
    private readonly _id: string,
    private _name: string,
    private _description: string,
    private _price: Money,
    private _stock: StockCount,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
  ) {}

  static create(props: CreateProductProps): Product {
    const product = new Product(
      crypto.randomUUID(),
      props.name,
      props.description,
      Money.create(props.price),
      StockCount.create(props.stock),
      new Date(),
      new Date(),
    );
    product._domainEvents.push(
      new ProductCreatedEvent(product._id, props.name),
    );
    return product;
  }

  static reconstitute(snapshot: ProductSnapshot): Product {
    return new Product(
      snapshot.id,
      snapshot.name,
      snapshot.description,
      Money.fromNumber(snapshot.price),
      StockCount.fromNumber(snapshot.stock),
      snapshot.createdAt,
      snapshot.updatedAt,
    );
  }

  update(
    props: Partial<{
      name: string;
      description: string;
      price: number;
      stock: number;
    }>,
  ): void {
    if (props.name !== undefined) this._name = props.name;
    if (props.description !== undefined) this._description = props.description;
    if (props.price !== undefined) this._price = Money.create(props.price);
    if (props.stock !== undefined) this._stock = StockCount.create(props.stock);
    this._updatedAt = new Date();
  }

  toSnapshot(): ProductSnapshot {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      price: this._price.amount,
      stock: this._stock.value,
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
  get description(): string {
    return this._description;
  }
  get price(): Money {
    return this._price;
  }
  get stock(): StockCount {
    return this._stock;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }
}
