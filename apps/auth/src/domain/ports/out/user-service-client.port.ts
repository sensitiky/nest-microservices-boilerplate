import { UserSnapshot } from '@api/common';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export interface IUserServiceClient {
  findByEmail(email: string): Promise<UserSnapshot | null>;
  create(data: CreateUserData): Promise<UserSnapshot>;
}
