import * as bcrypt from 'bcryptjs';

export class HashedPassword {
  private constructor(private readonly _value: string) {}

  static fromHash(hash: string): HashedPassword {
    return new HashedPassword(hash);
  }

  async compare(raw: string): Promise<boolean> {
    return bcrypt.compare(raw, this._value);
  }
}
