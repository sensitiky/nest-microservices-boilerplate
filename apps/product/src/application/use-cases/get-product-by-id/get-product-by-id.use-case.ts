import { Product } from '../../../domain/aggregates/product.aggregate';
import { ProductNotFoundException } from '../../../domain/exceptions/product-not-found.exception';
import { IProductRepository } from '../../../domain/ports/out/product.repository.port';

export class GetProductByIdUseCase {
  constructor(private readonly productRepo: IProductRepository) {}

  async execute(id: string): Promise<Product> {
    const product = await this.productRepo.findById(id);
    if (!product) throw new ProductNotFoundException(id);
    return product;
  }
}
