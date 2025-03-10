import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IGatewayService } from '../../domain/services/gateway.service.interface';
import { firstValueFrom } from 'rxjs';
import {
  LoginDto,
  RegisterDto,
  AuthResponseDto,
} from '../../domain/dtos/auth.dto';
import { UserDto, UpdateUserDto } from '../../domain/dtos/user.dto';
import {
  ProductDto,
  CreateProductDto,
  UpdateProductDto,
} from '../../domain/dtos/product.dto';

@Injectable()
export class GatewayService implements IGatewayService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    @Inject('PRODUCT_SERVICE') private readonly productClient: ClientProxy,
  ) {}

  // Auth methods
  async login(credentials: LoginDto): Promise<AuthResponseDto> {
    return await firstValueFrom(this.authClient.send('login', credentials));
  }

  async register(userData: RegisterDto): Promise<AuthResponseDto> {
    return await firstValueFrom(this.authClient.send('register', userData));
  }

  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    return await firstValueFrom(
      this.authClient.send('refresh-token', refreshToken),
    );
  }

  async logout(userId: string): Promise<void> {
    return await firstValueFrom(this.authClient.send('logout', userId));
  }

  // User methods
  async getAllUsers(): Promise<UserDto[]> {
    return await firstValueFrom(this.userClient.send('get-all-users', {}));
  }

  async getUserById(id: string): Promise<UserDto> {
    return await firstValueFrom(this.userClient.send('get-user-by-id', id));
  }

  async getMe(token: string): Promise<UserDto> {
    return await firstValueFrom(this.userClient.send('me', token));
  }

  async updateUser(id: string, user: UpdateUserDto): Promise<UserDto> {
    return await firstValueFrom(
      this.userClient.send('update-user', { id, user }),
    );
  }

  async deleteUser(id: string): Promise<void> {
    return await firstValueFrom(this.userClient.send('delete-user', id));
  }

  // Product methods
  async getAllProducts(): Promise<ProductDto[]> {
    return await firstValueFrom(
      this.productClient.send('get-all-products', {}),
    );
  }

  async getProductById(id: string): Promise<ProductDto> {
    return await firstValueFrom(
      this.productClient.send('get-product-by-id', id),
    );
  }

  async createProduct(product: CreateProductDto): Promise<ProductDto> {
    return await firstValueFrom(
      this.productClient.send('create-product', product),
    );
  }

  async updateProduct(
    id: string,
    product: UpdateProductDto,
  ): Promise<ProductDto> {
    return await firstValueFrom(
      this.productClient.send('update-product', { id, product }),
    );
  }

  async deleteProduct(id: string): Promise<void> {
    return await firstValueFrom(this.productClient.send('delete-product', id));
  }
}
