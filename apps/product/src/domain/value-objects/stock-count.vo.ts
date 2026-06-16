import { InvalidStockException } from '../exceptions/invalid-stock.exception';

export class StockCount {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  static create(value: number): StockCount {
    if (!Number.isInteger(value) || value < 0) throw new InvalidStockException(value);
    return new StockCount(value);
  }

  static fromNumber(value: number): StockCount {
    return new StockCount(value);
  }

  get value(): number {
    return this._value;
  }
}
