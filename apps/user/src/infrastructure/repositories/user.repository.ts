import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDomain } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../application/port/out/user.repository.interface';
import { User } from '@api/common';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User, 'postgresConnection')
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<UserDomain[]> {
    const userEntities = await this.userRepository.find();
    return userEntities.map(this.mapToDomain);
  }

  async findById(id: string): Promise<UserDomain> {
    const userEntity = await this.userRepository.findOne({
      where: { id },
    });
    return userEntity ? this.mapToDomain(userEntity) : null;
  }

  async findByEmail(email: string): Promise<UserDomain> {
    const userEntity = await this.userRepository.findOne({
      where: { email },
    });
    return userEntity ? this.mapToDomain(userEntity) : null;
  }

  async create(user: UserDomain): Promise<UserDomain> {
    const userEntity = this.mapToEntity(user);
    const savedEntity = await this.userRepository.save(userEntity);
    return this.mapToDomain(savedEntity);
  }

  async update(id: string, user: Partial<UserDomain>): Promise<UserDomain> {
    await this.userRepository.update(id, user);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  private mapToDomain(entity: User): UserDomain {
    return new UserDomain({
      id: entity.id,
      name: entity.name,
      email: entity.email,
      password: entity.password,
      avatar: entity.avatar,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  private mapToEntity(domain: UserDomain): User {
    const entity = new User();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.email = domain.email;
    entity.password = domain.password;
    entity.avatar = domain.avatar;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
