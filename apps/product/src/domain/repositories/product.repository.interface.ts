import { Product } from '../entities/product.entity';

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product>;
  create(product: Product): Promise<Product>;
  update(id: string, product: Partial<Product>): Promise<Product>;
  delete(id: string): Promise<void>;
}
