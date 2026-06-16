import { Product } from '../../../domain/aggregates/product.aggregate';
import { ProductOrmEntity } from '../entities/product.orm-entity';

export class ProductMapper {
  static toDomain(orm: ProductOrmEntity): Product {
    return Product.reconstitute({
      id: orm.id,
      name: orm.name,
      description: orm.description,
      price: Number(orm.price),
      stock: orm.stock,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toPersistence(domain: Product): ProductOrmEntity {
    const entity = new ProductOrmEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.description = domain.description;
    entity.price = domain.price.amount;
    entity.stock = domain.stock.value;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
