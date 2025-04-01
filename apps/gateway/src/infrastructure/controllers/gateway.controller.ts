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
import { FastifyRequest } from 'fastify';

@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  // Auth endpoints
  @ApiTags('Authentication')
  @ApiOperation({
    summary: 'User login',
    description: 'Login with email and password',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post('auth/login')
  async login(@Body() credentials: LoginDto) {
    return await this.gatewayService.login(credentials);
  }

  @ApiTags('Authentication')
  @ApiOperation({
    summary: 'User registration',
    description: 'Register a new user',
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @Post('auth/register')
  async register(@Body() userData: RegisterDto) {
    return await this.gatewayService.register(userData);
  }

  @ApiTags('Authentication')
  @ApiOperation({
    summary: 'Refresh token',
    description: 'Get a new access token using refresh token',
  })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @Post('auth/refresh-token')
  async refreshToken(@Body() { refreshToken }: RefreshTokenDto) {
    return await this.gatewayService.refreshToken(refreshToken);
  }

  @ApiTags('Authentication')
  @ApiOperation({ summary: 'Logout', description: 'Invalidate user session' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @Post('auth/logout')
  @UseGuards(AuthGuard)
  async logout(@Req() req) {
    return await this.gatewayService.logout(req.user.userId);
  }

  // User endpoints
  @ApiTags('Users')
  @ApiOperation({ summary: 'Get all users', description: 'Retrieve all users' })
  @ApiResponse({ status: 200, description: 'List of users', type: [UserDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @Get('users')
  @UseGuards(AuthGuard)
  async getAllUsers() {
    return await this.gatewayService.getAllUsers();
  }

  @ApiTags('Users')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieve a user by their ID',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User found', type: UserDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  @Get('users/:id')
  @UseGuards(AuthGuard)
  async getUserById(@Param('id') id: string) {
    return await this.gatewayService.getUserById(id);
  }

  @ApiTags('Users')
  @ApiOperation({
    summary: 'Get current user',
    description: 'Retrieve the current authenticated user',
  })
  @ApiResponse({ status: 200, description: 'Current user', type: UserDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @Get('users/me')
  @UseGuards(AuthGuard)
  async getMe(@Req() req: FastifyRequest) {
    return await this.gatewayService.getMe(req.headers.authorization);
  }

  @ApiTags('Users')
  @ApiOperation({
    summary: 'Update user',
    description: 'Update a user by their ID',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  @Put('users/:id')
  @UseGuards(AuthGuard)
  async updateUser(@Param('id') id: string, @Body() user: UpdateUserDto) {
    return await this.gatewayService.updateUser(id, user);
  }

  @ApiTags('Users')
  @ApiOperation({
    summary: 'Delete user',
    description: 'Delete a user by their ID',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  @Delete('users/:id')
  @UseGuards(AuthGuard)
  async deleteUser(@Param('id') id: string) {
    return await this.gatewayService.deleteUser(id);
  }

  // Product endpoints
  @ApiTags('Products')
  @ApiOperation({
    summary: 'Get all products',
    description: 'Retrieve all products',
  })
  @ApiResponse({
    status: 200,
    description: 'List of products',
    type: [ProductDto],
  })
  @Get('products')
  async getAllProducts() {
    return await this.gatewayService.getAllProducts();
  }

  @ApiTags('Products')
  @ApiOperation({
    summary: 'Get product by ID',
    description: 'Retrieve a product by its ID',
  })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product found', type: ProductDto })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @Get('products/:id')
  async getProductById(@Param('id') id: string) {
    return await this.gatewayService.getProductById(id);
  }

  @ApiTags('Products')
  @ApiOperation({
    summary: 'Create product',
    description: 'Create a new product',
  })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: ProductDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiBearerAuth()
  @Post('products')
  @UseGuards(AuthGuard)
  async createProduct(@Body() product: CreateProductDto) {
    return await this.gatewayService.createProduct(product);
  }

  @ApiTags('Products')
  @ApiOperation({
    summary: 'Update product',
    description: 'Update a product by its ID',
  })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: ProductDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiBearerAuth()
  @Put('products/:id')
  @UseGuards(AuthGuard)
  async updateProduct(
    @Param('id') id: string,
    @Body() product: UpdateProductDto,
  ) {
    return await this.gatewayService.updateProduct(id, product);
  }

  @ApiTags('Products')
  @ApiOperation({
    summary: 'Delete product',
    description: 'Delete a product by its ID',
  })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiBearerAuth()
  @Delete('products/:id')
  @UseGuards(AuthGuard)
  async deleteProduct(@Param('id') id: string) {
    return await this.gatewayService.deleteProduct(id);
  }
}
