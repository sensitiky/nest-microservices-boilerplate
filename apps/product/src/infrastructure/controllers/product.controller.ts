import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateProductUseCase } from '../../application/use-cases/create-product/create-product.use-case';
import { GetProductByIdUseCase } from '../../application/use-cases/get-product-by-id/get-product-by-id.use-case';
import { GetAllProductsUseCase } from '../../application/use-cases/get-all-products/get-all-products.use-case';
import { UpdateProductUseCase } from '../../application/use-cases/update-product/update-product.use-case';
import { DeleteProductUseCase } from '../../application/use-cases/delete-product/delete-product.use-case';
import { CreateProductCommand } from '../../application/use-cases/create-product/create-product.command';
import { UpdateProductCommand } from '../../application/use-cases/update-product/update-product.command';

@Controller()
export class ProductController {
  constructor(
    private readonly createProduct: CreateProductUseCase,
    private readonly getProductById: GetProductByIdUseCase,
    private readonly getAllProducts: GetAllProductsUseCase,
    private readonly updateProduct: UpdateProductUseCase,
    private readonly deleteProduct: DeleteProductUseCase,
  ) {}

  @MessagePattern('create-product')
  async handleCreateProduct(@Payload() command: CreateProductCommand) {
    const product = await this.createProduct.execute(command);
    return product.toSnapshot();
  }

  @MessagePattern('get-product-by-id')
  async handleGetProductById(@Payload() id: string) {
    const product = await this.getProductById.execute(id);
    return product.toSnapshot();
  }

  @MessagePattern('get-all-products')
  async handleGetAllProducts() {
    const products = await this.getAllProducts.execute();
    return products.map((p) => p.toSnapshot());
  }

  @MessagePattern('update-product')
  async handleUpdateProduct(
    @Payload() payload: { id: string; product: Omit<UpdateProductCommand, 'id'> },
  ) {
    const product = await this.updateProduct.execute({ id: payload.id, ...payload.product });
    return product.toSnapshot();
  }

  @MessagePattern('delete-product')
  async handleDeleteProduct(@Payload() id: string) {
    await this.deleteProduct.execute(id);
  }
}
