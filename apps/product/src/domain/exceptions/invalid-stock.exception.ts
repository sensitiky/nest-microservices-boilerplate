export class InvalidStockException extends Error {
  constructor(value: number) {
    super(`Invalid stock: ${value}. Stock must be a non-negative integer.`);
    this.name = 'InvalidStockException';
  }
}
