import * as bcrypt from 'bcryptjs';

export class HashedPassword {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static async fromRaw(raw: string): Promise<HashedPassword> {
    const hash = await bcrypt.hash(raw, 10);
    return new HashedPassword(hash);
  }

  static fromHash(hash: string): HashedPassword {
    return new HashedPassword(hash);
  }

  async compare(raw: string): Promise<boolean> {
    return bcrypt.compare(raw, this._value);
  }

  get value(): string {
    return this._value;
  }
}
