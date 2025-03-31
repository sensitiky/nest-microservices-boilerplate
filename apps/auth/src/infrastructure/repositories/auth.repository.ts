import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAuthRepository } from '../../domain/repositories/auth.repository.interface';
import { AuthEntity } from '../entities/auth.entity';
import { Auth } from '@api/common';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(
    @InjectRepository(Auth, 'postgresConnection')
    private readonly authRepository: Repository<AuthEntity>,
  ) {}

  async findById(id: string): Promise<Auth> {
    const authEntity = await this.authRepository.findOne({
      where: { id },
    });
    return authEntity ? authEntity : null;
  }

  async findByUserId(userId: string): Promise<Auth> {
    const authEntity = await this.authRepository.findOne({
      where: { userId },
    });
    return authEntity ? authEntity : null;
  }

  async create(auth: Auth): Promise<Auth> {
    const authEntity = this.mapToEntity(auth);
    await this.authRepository.save(authEntity);
    return authEntity;
  }

  async update(id: string, auth: Partial<Auth>): Promise<Auth> {
    await this.authRepository.update(id, auth);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.authRepository.delete(id);
  }

  private mapToEntity(domain: Auth): AuthEntity {
    const entity = new AuthEntity();
    entity.id = domain.id;
    entity.userId = domain.userId;
    entity.accessToken = domain.accessToken;
    entity.refreshToken = domain.refreshToken;
    entity.expiresAt = domain.expiresAt;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
