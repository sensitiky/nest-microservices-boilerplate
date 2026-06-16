export class InvalidPriceException extends Error {
  constructor(value: number) {
    super(`Invalid price: ${value}. Price must be non-negative.`);
    this.name = 'InvalidPriceException';
  }
}
