import { ProductNotFoundException } from '../../../domain/exceptions/product-not-found.exception';
import { IProductRepository } from '../../../domain/ports/out/product.repository.port';

export class DeleteProductUseCase {
  constructor(private readonly productRepo: IProductRepository) {}

  async execute(id: string): Promise<void> {
    const product = await this.productRepo.findById(id);
    if (!product) throw new ProductNotFoundException(id);
    await this.productRepo.delete(id);
  }
}
