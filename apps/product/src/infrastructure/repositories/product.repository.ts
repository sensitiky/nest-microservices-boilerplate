import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../domain/entities/product.entity';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { ProductEntity } from '../entities/product.entity';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductEntity, 'postgresConnection')
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async findAll(): Promise<Product[]> {
    const productEntities = await this.productRepository.find();
    return productEntities.map(this.mapToDomain);
  }

  async findById(id: string): Promise<Product> {
    const productEntity = await this.productRepository.findOne({
      where: { id },
    });
    return productEntity ? this.mapToDomain(productEntity) : null;
  }

  async create(product: Product): Promise<Product> {
    const productEntity = this.mapToEntity(product);
    const savedEntity = await this.productRepository.save(productEntity);
    return this.mapToDomain(savedEntity);
  }

  async update(id: string, product: Partial<Product>): Promise<Product> {
    await this.productRepository.update(id, product);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }

  private mapToDomain(entity: ProductEntity): Product {
    return new Product({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      price: entity.price,
      stock: entity.stock,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
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
