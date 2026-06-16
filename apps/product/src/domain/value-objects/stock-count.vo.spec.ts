import { describe, it, expect } from 'bun:test';
import { StockCount } from './stock-count.vo';
import { InvalidStockException } from '../exceptions/invalid-stock.exception';

describe('StockCount', () => {
  it('creates valid stock count', () => {
    const s = StockCount.create(10);
    expect(s.value).toBe(10);
  });

  it('creates zero stock', () => {
    expect(StockCount.create(0).value).toBe(0);
  });

  it('throws InvalidStockException for negative value', () => {
    expect(() => StockCount.create(-1)).toThrow(InvalidStockException);
  });

  it('throws InvalidStockException for non-integer', () => {
    expect(() => StockCount.create(1.5)).toThrow(InvalidStockException);
  });
});
