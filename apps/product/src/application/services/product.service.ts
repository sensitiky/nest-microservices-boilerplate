import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { IProductService } from '../../domain/services/product.service.interface';

@Injectable()
export class ProductService implements IProductService {
  constructor(
    @Inject('IProductRepository')
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
    await this.getProductById(id); // Verify product exists
    return await this.productRepository.update(id, product);
  }

  async deleteProduct(id: string): Promise<void> {
    await this.getProductById(id); // Verify product exists
    await this.productRepository.delete(id);
  }
}
