export interface UserSnapshot {
  id: string;
  name: string;
  email: string;
  hashedPassword: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SafeUserSnapshot {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}
