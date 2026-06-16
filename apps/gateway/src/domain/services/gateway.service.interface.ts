import { LoginDto, RegisterDto, AuthResponseDto } from '../dtos/auth.dto';
import { UserDto, UpdateUserDto } from '../dtos/user.dto';
import { ProductDto, CreateProductDto, UpdateProductDto } from '../dtos/product.dto';

export interface IGatewayService {
  login(credentials: LoginDto): Promise<AuthResponseDto>;
  register(userData: RegisterDto): Promise<AuthResponseDto>;
  refreshToken(refreshToken: string): Promise<AuthResponseDto>;
  logout(userId: string): Promise<void>;

  getAllUsers(): Promise<UserDto[]>;
  getUserById(id: string): Promise<UserDto>;
  getMe(userId: string): Promise<UserDto>;
  updateUser(id: string, user: UpdateUserDto): Promise<UserDto>;
  deleteUser(id: string): Promise<void>;

  getAllProducts(): Promise<ProductDto[]>;
  getProductById(id: string): Promise<ProductDto>;
  createProduct(product: CreateProductDto): Promise<ProductDto>;
  updateProduct(id: string, product: UpdateProductDto): Promise<ProductDto>;
  deleteProduct(id: string): Promise<void>;
}
