export interface IGatewayService {
  // Auth
  login(credentials: { email: string; password: string }): Promise<any>;
  register(userData: {
    email: string;
    password: string;
    name: string;
  }): Promise<any>;
  refreshToken(refreshToken: string): Promise<any>;
  logout(userId: string): Promise<void>;

  // User
  getAllUsers(): Promise<any[]>;
  getUserById(id: string): Promise<any>;
  getMe(token: string): Promise<any>;
  updateUser(id: string, user: any): Promise<any>;
  deleteUser(id: string): Promise<void>;

  // Product
  getAllProducts(): Promise<any[]>;
  getProductById(id: string): Promise<any>;
  createProduct(product: any): Promise<any>;
  updateProduct(id: string, product: any): Promise<any>;
  deleteProduct(id: string): Promise<void>;
}
