import { InvalidPriceException } from '../exceptions/invalid-price.exception';

export class Money {
  private readonly _amount: number;

  private constructor(amount: number) {
    this._amount = amount;
  }

  static create(amount: number): Money {
    if (amount < 0) throw new InvalidPriceException(amount);
    return new Money(Math.round(amount * 100) / 100);
  }

  static fromNumber(amount: number): Money {
    return new Money(amount);
  }

  get amount(): number {
    return this._amount;
  }

  equals(other: Money): boolean {
    return this._amount === other._amount;
  }
}
