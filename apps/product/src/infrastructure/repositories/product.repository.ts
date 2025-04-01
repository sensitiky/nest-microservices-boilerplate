import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { ProductEntity } from '../entities/product.entity';
import { Product } from '@api/common';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(Product, 'postgresConnection')
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async findAll(): Promise<Product[]> {
    const productEntities = await this.productRepository.find();
    return productEntities;
  }

  async findById(id: string): Promise<Product> {
    const productEntity = await this.productRepository.findOne({
      where: { id },
    });
    return productEntity;
  }

  async create(product: Product): Promise<Product> {
    const productEntity = this.mapToEntity(product);
    const savedEntity = await this.productRepository.save(productEntity);
    return savedEntity;
  }

  async update(id: string, product: Partial<Product>): Promise<Product> {
    await this.productRepository.update(id, product);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }

  private mapToEntity(domain: Product): ProductEntity {
    const entity = new ProductEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.description = domain.description;
    entity.price = domain.price;
    entity.stock = domain.stock;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
