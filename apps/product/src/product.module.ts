import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './application/services/product.service';
import { ProductRepository } from './infrastructure/repositories/product.repository';
import { ProductController } from './infrastructure/controllers/product.controller';
import { ProductEntity } from './infrastructure/entities/product.entity';
import { DatabaseModule } from '@api/config';
import {
  ProductRepositorySymbol,
  ProductServiceSymbol,
} from './domain/symbols/product.symbol';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    DatabaseModule,
    TypeOrmModule.forFeature([ProductEntity], 'postgresConnection'),
  ],
  controllers: [ProductController],
  providers: [
    {
      provide: ProductRepositorySymbol,
      useClass: ProductRepository,
    },
    { provide: ProductServiceSymbol, useClass: ProductService },
  ],
})
export class ProductModule {}
