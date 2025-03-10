import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IGatewayService } from '../../domain/services/gateway.service.interface';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GatewayService implements IGatewayService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    @Inject('PRODUCT_SERVICE') private readonly productClient: ClientProxy,
  ) {}

  // Auth methods
  async login(credentials: { email: string; password: string }): Promise<any> {
    return await firstValueFrom(this.authClient.send('login', credentials));
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
  }): Promise<any> {
    return await firstValueFrom(this.authClient.send('register', userData));
  }

  async refreshToken(refreshToken: string): Promise<any> {
    return await firstValueFrom(
      this.authClient.send('refresh-token', refreshToken),
    );
  }

  async logout(userId: string): Promise<void> {
    return await firstValueFrom(this.authClient.send('logout', userId));
  }

  // User methods
  async getAllUsers(): Promise<any[]> {
    return await firstValueFrom(this.userClient.send('get-all-users', {}));
  }

  async getUserById(id: string): Promise<any> {
    return await firstValueFrom(this.userClient.send('get-user-by-id', id));
  }

  async getMe(token: string): Promise<any> {
    return await firstValueFrom(this.userClient.send('me', token));
  }

  async updateUser(id: string, user: any): Promise<any> {
    return await firstValueFrom(
      this.userClient.send('update-user', { id, user }),
    );
  }

  async deleteUser(id: string): Promise<void> {
    return await firstValueFrom(this.userClient.send('delete-user', id));
  }

  // Product methods
  async getAllProducts(): Promise<any[]> {
    return await firstValueFrom(
      this.productClient.send('get-all-products', {}),
    );
  }

  async getProductById(id: string): Promise<any> {
    return await firstValueFrom(
      this.productClient.send('get-product-by-id', id),
    );
  }

  async createProduct(product: any): Promise<any> {
    return await firstValueFrom(
      this.productClient.send('create-product', product),
    );
  }

  async updateProduct(id: string, product: any): Promise<any> {
    return await firstValueFrom(
      this.productClient.send('update-product', { id, product }),
    );
  }

  async deleteProduct(id: string): Promise<void> {
    return await firstValueFrom(this.productClient.send('delete-product', id));
  }
}
