import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity, 'postgresConnection')
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<User[]> {
    const userEntities = await this.userRepository.find();
    return userEntities.map(this.mapToDomain);
  }

  async findById(id: string): Promise<User> {
    const userEntity = await this.userRepository.findOne({
      where: { id },
    });
    return userEntity ? this.mapToDomain(userEntity) : null;
  }

  async findByEmail(email: string): Promise<User> {
    const userEntity = await this.userRepository.findOne({
      where: { email },
    });
    return userEntity ? this.mapToDomain(userEntity) : null;
  }

  async create(user: User): Promise<User> {
    const userEntity = this.mapToEntity(user);
    const savedEntity = await this.userRepository.save(userEntity);
    return this.mapToDomain(savedEntity);
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    await this.userRepository.update(id, user);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  private mapToDomain(entity: UserEntity): User {
    return new User({
      id: entity.id,
      name: entity.name,
      email: entity.email,
      password: entity.password,
      avatar: entity.avatar,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  private mapToEntity(domain: User): UserEntity {
    const entity = new UserEntity();
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
