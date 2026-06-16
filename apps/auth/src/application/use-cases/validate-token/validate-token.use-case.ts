import { ITokenGenerator } from '../../../domain/ports/out/token-generator.port';

export class ValidateTokenUseCase {
  constructor(private readonly tokenGenerator: ITokenGenerator) {}

  execute(token: string): boolean {
    return this.tokenGenerator.verifyToken(token);
  }
}
