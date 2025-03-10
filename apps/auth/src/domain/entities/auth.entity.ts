export class Auth {
  id: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(params: {
    id?: string;
    userId: string;
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = params.id;
    this.userId = params.userId;
    this.accessToken = params.accessToken;
    this.refreshToken = params.refreshToken;
    this.expiresAt = params.expiresAt;
    this.createdAt = params.createdAt || new Date();
    this.updatedAt = params.updatedAt || new Date();
  }
}
