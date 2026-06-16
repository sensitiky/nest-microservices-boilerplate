import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../../domain/aggregates/product.aggregate';
import { IProductRepository } from '../../../domain/ports/out/product.repository.port';
import { ProductOrmEntity } from '../entities/product.orm-entity';
import { ProductMapper } from '../mappers/product.mapper';

@Injectable()
export class ProductTypeOrmRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity, 'postgresConnection')
    private readonly repo: Repository<ProductOrmEntity>,
  ) {}

  async findById(id: string): Promise<Product | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? ProductMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<Product[]> {
    const entities = await this.repo.find();
    return entities.map(ProductMapper.toDomain);
  }

  async save(product: Product): Promise<void> {
    await this.repo.save(ProductMapper.toPersistence(product));
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
