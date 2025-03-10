import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductService } from '../../application/services/product.service';
import { Product } from '../../domain/entities/product.entity';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern('get-all-products')
  async getAllProducts() {
    return await this.productService.getAllProducts();
  }

  @MessagePattern('get-product-by-id')
  async getProductById(@Payload() id: string) {
    return await this.productService.getProductById(id);
  }

  @MessagePattern('create-product')
  async createProduct(@Payload() product: Product) {
    return await this.productService.createProduct(product);
  }

  @MessagePattern('update-product')
  async updateProduct(
    @Payload() payload: { id: string; product: Partial<Product> },
  ) {
    return await this.productService.updateProduct(payload.id, payload.product);
  }

  @MessagePattern('delete-product')
  async deleteProduct(@Payload() id: string) {
    return await this.productService.deleteProduct(id);
  }
}
