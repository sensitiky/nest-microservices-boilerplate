import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './application/services/product.service';
import { ProductRepository } from './infrastructure/repositories/product.repository';
import { ProductController } from './infrastructure/controllers/product.controller';
import { ProductEntity } from './infrastructure/entities/product.entity';
import { DatabaseModule } from '@api/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    DatabaseModule,
    TypeOrmModule.forFeature([ProductEntity], 'postgresConnection'),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
    { provide: 'IProductService', useClass: ProductService },
  ],
})
export class ProductModule {}
