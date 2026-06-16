import { Product } from '../../../domain/aggregates/product.aggregate';
import { IProductRepository } from '../../../domain/ports/out/product.repository.port';
import { CreateProductCommand } from './create-product.command';

export class CreateProductUseCase {
  constructor(private readonly productRepo: IProductRepository) {}

  async execute(command: CreateProductCommand): Promise<Product> {
    const product = Product.create(command);
    await this.productRepo.save(product);
    return product;
  }
}
