import { Product } from '../../../domain/aggregates/product.aggregate';
import { IProductRepository } from '../../../domain/ports/out/product.repository.port';

export class GetAllProductsUseCase {
  constructor(private readonly productRepo: IProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.productRepo.findAll();
  }
}
