export class User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(params: {
    id?: string;
    name: string;
    email: string;
    password: string;
    avatar?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.email = params.email;
    this.password = params.password;
    this.avatar = params.avatar;
    this.createdAt = params.createdAt || new Date();
    this.updatedAt = params.updatedAt || new Date();
  }
}
