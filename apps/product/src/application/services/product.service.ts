import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import { IProductRepository } from '../port/out/product.repository.interface';
import { IProductService } from '../port/in/product.service.interface';
import { ProductRepositorySymbol } from '../../domain/symbols/product.symbol';

@Injectable()
export class ProductService implements IProductService {
  constructor(
    @Inject(ProductRepositorySymbol)
    private readonly productRepository: IProductRepository,
  ) {}

  async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async createProduct(product: Product): Promise<Product> {
    return await this.productRepository.create(product);
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const [_, updatedProduct] = await Promise.all([
      await this.getProductById(id),
      await this.productRepository.update(id, product),
    ]);
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    await Promise.all([
      this.getProductById(id),
      this.productRepository.delete(id),
    ]);
  }
}
