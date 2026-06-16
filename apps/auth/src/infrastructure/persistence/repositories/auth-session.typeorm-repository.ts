import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthSession } from '../../../domain/aggregates/auth-session.aggregate';
import { IAuthSessionRepository } from '../../../domain/ports/out/auth-session.repository.port';
import { AuthSessionOrmEntity } from '../entities/auth-session.orm-entity';
import { AuthSessionMapper } from '../mappers/auth-session.mapper';

@Injectable()
export class AuthSessionTypeOrmRepository implements IAuthSessionRepository {
  constructor(
    @InjectRepository(AuthSessionOrmEntity, 'postgresConnection')
    private readonly repo: Repository<AuthSessionOrmEntity>,
  ) {}

  async findById(id: string): Promise<AuthSession | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? AuthSessionMapper.toDomain(entity) : null;
  }

  async findByUserId(userId: string): Promise<AuthSession | null> {
    const entity = await this.repo.findOne({ where: { userId } });
    return entity ? AuthSessionMapper.toDomain(entity) : null;
  }

  async save(session: AuthSession): Promise<void> {
    await this.repo.save(AuthSessionMapper.toPersistence(session));
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
