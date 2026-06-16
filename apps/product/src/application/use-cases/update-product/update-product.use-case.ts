import { Product } from '../../../domain/aggregates/product.aggregate';
import { ProductNotFoundException } from '../../../domain/exceptions/product-not-found.exception';
import { IProductRepository } from '../../../domain/ports/out/product.repository.port';
import { UpdateProductCommand } from './update-product.command';

export class UpdateProductUseCase {
  constructor(private readonly productRepo: IProductRepository) {}

  async execute(command: UpdateProductCommand): Promise<Product> {
    const product = await this.productRepo.findById(command.id);
    if (!product) throw new ProductNotFoundException(command.id);
    product.update({
      name: command.name,
      description: command.description,
      price: command.price,
      stock: command.stock,
    });
    await this.productRepo.save(product);
    return product;
  }
}
