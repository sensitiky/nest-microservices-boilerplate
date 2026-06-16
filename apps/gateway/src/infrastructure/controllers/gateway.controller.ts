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
import { AuthGuard } from '@api/config';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  AuthResponseDto,
} from '../../domain/dtos/auth.dto';
import { UserDto, UpdateUserDto } from '../../domain/dtos/user.dto';
import {
  ProductDto,
  CreateProductDto,
  UpdateProductDto,
} from '../../domain/dtos/product.dto';

@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @ApiTags('Authentication')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post('auth/login')
  async login(@Body() credentials: LoginDto) {
    return await this.gatewayService.login(credentials);
  }

  @ApiTags('Authentication')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  @Post('auth/register')
  async register(@Body() userData: RegisterDto) {
    return await this.gatewayService.register(userData);
  }

  @ApiTags('Authentication')
  @ApiOperation({ summary: 'Refresh token' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  @Post('auth/refresh-token')
  async refreshToken(@Body() { refreshToken }: RefreshTokenDto) {
    return await this.gatewayService.refreshToken(refreshToken);
  }

  @ApiTags('Authentication')
  @ApiOperation({ summary: 'Logout' })
  @ApiBearerAuth('access-token')
  @Post('auth/logout')
  @UseGuards(AuthGuard)
  async logout(@Req() req: any) {
    return await this.gatewayService.logout(req.user.userId);
  }

  @ApiTags('Users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [UserDto] })
  @ApiBearerAuth('access-token')
  @Get('users')
  @UseGuards(AuthGuard)
  async getAllUsers() {
    return await this.gatewayService.getAllUsers();
  }

  @ApiTags('Users')
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, type: UserDto })
  @ApiBearerAuth('access-token')
  @Get('users/me')
  @UseGuards(AuthGuard)
  async getMe(@Req() req: any) {
    return await this.gatewayService.getMe(req.user.userId);
  }

  @ApiTags('Users')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: UserDto })
  @ApiBearerAuth('access-token')
  @Get('users/:id')
  @UseGuards(AuthGuard)
  async getUserById(@Param('id') id: string) {
    return await this.gatewayService.getUserById(id);
  }

  @ApiTags('Users')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id' })
  @ApiBearerAuth('access-token')
  @Put('users/:id')
  @UseGuards(AuthGuard)
  async updateUser(@Param('id') id: string, @Body() user: UpdateUserDto) {
    return await this.gatewayService.updateUser(id, user);
  }

  @ApiTags('Users')
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id' })
  @ApiBearerAuth('access-token')
  @Delete('users/:id')
  @UseGuards(AuthGuard)
  async deleteUser(@Param('id') id: string) {
    return await this.gatewayService.deleteUser(id);
  }

  @ApiTags('Products')
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, type: [ProductDto] })
  @Get('products')
  async getAllProducts() {
    return await this.gatewayService.getAllProducts();
  }

  @ApiTags('Products')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: ProductDto })
  @Get('products/:id')
  async getProductById(@Param('id') id: string) {
    return await this.gatewayService.getProductById(id);
  }

  @ApiTags('Products')
  @ApiOperation({ summary: 'Create product' })
  @ApiBearerAuth('access-token')
  @Post('products')
  @UseGuards(AuthGuard)
  async createProduct(@Body() product: CreateProductDto) {
    return await this.gatewayService.createProduct(product);
  }

  @ApiTags('Products')
  @ApiOperation({ summary: 'Update product' })
  @ApiParam({ name: 'id' })
  @ApiBearerAuth('access-token')
  @Put('products/:id')
  @UseGuards(AuthGuard)
  async updateProduct(@Param('id') id: string, @Body() product: UpdateProductDto) {
    return await this.gatewayService.updateProduct(id, product);
  }

  @ApiTags('Products')
  @ApiOperation({ summary: 'Delete product' })
  @ApiParam({ name: 'id' })
  @ApiBearerAuth('access-token')
  @Delete('products/:id')
  @UseGuards(AuthGuard)
  async deleteProduct(@Param('id') id: string) {
    return await this.gatewayService.deleteProduct(id);
  }
}
