import { describe, it, expect } from 'bun:test';
import { Money } from './money.vo';
import { InvalidPriceException } from '../exceptions/invalid-price.exception';

describe('Money', () => {
  it('creates valid money rounded to 2 decimals', () => {
    const m = Money.create(9.999);
    expect(m.amount).toBe(10);
  });

  it('creates zero money', () => {
    const m = Money.create(0);
    expect(m.amount).toBe(0);
  });

  it('throws InvalidPriceException for negative value', () => {
    expect(() => Money.create(-1)).toThrow(InvalidPriceException);
  });

  it('equals returns true for same amount', () => {
    expect(Money.create(5).equals(Money.create(5))).toBe(true);
  });
});
