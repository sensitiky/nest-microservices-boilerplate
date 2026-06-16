import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '@api/config';
import { ProductController } from './infrastructure/controllers/product.controller';
import { ProductTypeOrmRepository } from './infrastructure/persistence/repositories/product.typeorm-repository';
import { ProductOrmEntity } from './infrastructure/persistence/entities/product.orm-entity';
import { CreateProductUseCase } from './application/use-cases/create-product/create-product.use-case';
import { GetProductByIdUseCase } from './application/use-cases/get-product-by-id/get-product-by-id.use-case';
import { GetAllProductsUseCase } from './application/use-cases/get-all-products/get-all-products.use-case';
import { UpdateProductUseCase } from './application/use-cases/update-product/update-product.use-case';
import { DeleteProductUseCase } from './application/use-cases/delete-product/delete-product.use-case';
import { ProductRepositorySymbol } from './domain/symbols/product.symbol';
import { IProductRepository } from './domain/ports/out/product.repository.port';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    DatabaseModule,
    TypeOrmModule.forFeature([ProductOrmEntity], 'postgresConnection'),
  ],
  controllers: [ProductController],
  providers: [
    {
      provide: ProductRepositorySymbol,
      useClass: ProductTypeOrmRepository,
    },
    {
      provide: CreateProductUseCase,
      useFactory: (repo: IProductRepository) => new CreateProductUseCase(repo),
      inject: [ProductRepositorySymbol],
    },
    {
      provide: GetProductByIdUseCase,
      useFactory: (repo: IProductRepository) => new GetProductByIdUseCase(repo),
      inject: [ProductRepositorySymbol],
    },
    {
      provide: GetAllProductsUseCase,
      useFactory: (repo: IProductRepository) => new GetAllProductsUseCase(repo),
      inject: [ProductRepositorySymbol],
    },
    {
      provide: UpdateProductUseCase,
      useFactory: (repo: IProductRepository) => new UpdateProductUseCase(repo),
      inject: [ProductRepositorySymbol],
    },
    {
      provide: DeleteProductUseCase,
      useFactory: (repo: IProductRepository) => new DeleteProductUseCase(repo),
      inject: [ProductRepositorySymbol],
    },
  ],
})
export class ProductModule {}
