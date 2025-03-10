export class Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(params: {
    id?: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.description = params.description;
    this.price = params.price;
    this.stock = params.stock;
    this.createdAt = params.createdAt || new Date();
    this.updatedAt = params.updatedAt || new Date();
  }
}
