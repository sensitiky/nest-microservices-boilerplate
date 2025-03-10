import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GatewayService } from '../../application/services/gateway.service';
import { JwtAuthGuard } from '@api/config';

@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  // Auth endpoints
  @Post('auth/login')
  async login(@Body() credentials: { email: string; password: string }) {
    return await this.gatewayService.login(credentials);
  }

  @Post('auth/register')
  async register(
    @Body() userData: { email: string; password: string; name: string },
  ) {
    return await this.gatewayService.register(userData);
  }

  @Post('auth/refresh-token')
  async refreshToken(@Body() { refreshToken }: { refreshToken: string }) {
    return await this.gatewayService.refreshToken(refreshToken);
  }

  @Post('auth/logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req) {
    return await this.gatewayService.logout(req.user.userId);
  }

  // User endpoints
  @Get('users')
  @UseGuards(JwtAuthGuard)
  async getAllUsers() {
    return await this.gatewayService.getAllUsers();
  }

  @Get('users/:id')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param('id') id: string) {
    return await this.gatewayService.getUserById(id);
  }

  @Get('users/me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req) {
    return await this.gatewayService.getMe(req.headers.authorization);
  }

  @Put('users/:id')
  @UseGuards(JwtAuthGuard)
  async updateUser(@Param('id') id: string, @Body() user: any) {
    return await this.gatewayService.updateUser(id, user);
  }

  @Delete('users/:id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('id') id: string) {
    return await this.gatewayService.deleteUser(id);
  }

  // Product endpoints
  @Get('products')
  async getAllProducts() {
    return await this.gatewayService.getAllProducts();
  }

  @Get('products/:id')
  async getProductById(@Param('id') id: string) {
    return await this.gatewayService.getProductById(id);
  }

  @Post('products')
  @UseGuards(JwtAuthGuard)
  async createProduct(@Body() product: any) {
    return await this.gatewayService.createProduct(product);
  }

  @Put('products/:id')
  @UseGuards(JwtAuthGuard)
  async updateProduct(@Param('id') id: string, @Body() product: any) {
    return await this.gatewayService.updateProduct(id, product);
  }

  @Delete('products/:id')
  @UseGuards(JwtAuthGuard)
  async deleteProduct(@Param('id') id: string) {
    return await this.gatewayService.deleteProduct(id);
  }
}
