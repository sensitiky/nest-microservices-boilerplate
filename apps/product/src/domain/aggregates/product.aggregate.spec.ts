import { describe, it, expect } from 'bun:test';
import { Product } from './product.aggregate';
import { InvalidPriceException } from '../exceptions/invalid-price.exception';
import { InvalidStockException } from '../exceptions/invalid-stock.exception';

describe('Product aggregate', () => {
  const validProps = {
    name: 'Widget',
    description: 'A widget',
    price: 9.99,
    stock: 100,
  };

  it('creates product and emits ProductCreatedEvent', () => {
    const product = Product.create(validProps);
    expect(product.id).toBeTruthy();
    expect(product.price.amount).toBe(9.99);
    expect(product.stock.value).toBe(100);
    const events = product.pullDomainEvents();
    expect(events).toHaveLength(1);
    expect((events[0] as any).name).toBe('ProductCreatedEvent');
  });

  it('throws InvalidPriceException for negative price', () => {
    expect(() => Product.create({ ...validProps, price: -1 })).toThrow(
      InvalidPriceException,
    );
  });

  it('throws InvalidStockException for fractional stock', () => {
    expect(() => Product.create({ ...validProps, stock: 1.5 })).toThrow(
      InvalidStockException,
    );
  });

  it('updates fields correctly', () => {
    const product = Product.create(validProps);
    product.update({ name: 'Gadget', price: 19.99 });
    expect(product.name).toBe('Gadget');
    expect(product.price.amount).toBe(19.99);
    expect(product.description).toBe('A widget');
  });

  it('reconstitutes from snapshot without emitting events', () => {
    const now = new Date();
    const product = Product.reconstitute({
      id: 'x',
      name: 'W',
      description: 'D',
      price: 5,
      stock: 3,
      createdAt: now,
      updatedAt: now,
    });
    expect(product.id).toBe('x');
    expect(product.pullDomainEvents()).toHaveLength(0);
  });
});
