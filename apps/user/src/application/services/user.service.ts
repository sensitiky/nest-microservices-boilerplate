import {
  ConsoleLogger,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDomain } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { IUserService } from '../../domain/services/user.service.interface';

@Injectable()
export class UserService implements IUserService {
  private readonly logger = new ConsoleLogger('UserService');

  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async getAllUsers(): Promise<UserDomain[]> {
    return await this.userRepository.findAll();
  }

  async getUserById(id: string): Promise<UserDomain> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<UserDomain> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async createUser(user: UserDomain): Promise<UserDomain> {
    return await this.userRepository.create(user);
  }

  async updateUser(id: string, user: Partial<UserDomain>): Promise<UserDomain> {
    await this.getUserById(id);
    return await this.userRepository.update(id, user);
  }

  async deleteUser(id: string): Promise<void> {
    await this.getUserById(id);
    await this.userRepository.delete(id);
  }

  async getMe(token: string): Promise<Partial<UserDomain>> {
    try {
      const decodedToken = await this.decodeToken(token);
      const user = await this.userRepository.findById(decodedToken.userId);
      if (!user) throw new NotFoundException('User not found');
      return this.sanitizeUser(user);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private async decodeToken(token: string): Promise<any> {
    const decodedToken = await this.jwtService.decode(
      token.replace('Bearer ', ''),
    );
    if (!decodedToken) throw new UnauthorizedException('Invalid token');
    return decodedToken;
  }

  private sanitizeUser(user: UserDomain): Partial<UserDomain> {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}
