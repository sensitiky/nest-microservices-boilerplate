export interface ITokenGenerator {
  generateAccessToken(userId: string): string;
  generateRefreshToken(userId: string): string;
  verifyToken(token: string): boolean;
  decodeToken(token: string): { userId: string } | null;
}
