import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAuthRepository } from '../../domain/repositories/auth.repository.interface';
import { Auth } from '@api/common';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(
    @InjectRepository(Auth, 'postgresConnection')
    private readonly authRepository: Repository<Auth>,
  ) {}

  async findById(id: string): Promise<Auth> {
    const authEntity = await this.authRepository.findOne({
      where: { id },
    });
    return authEntity;
  }

  async findByUserId(userId: string): Promise<Auth> {
    const authEntity = await this.authRepository.findOne({
      where: { userId },
    });
    return authEntity;
  }

  async create(auth: Auth): Promise<Auth> {
    const authEntity = await this.authRepository.save(auth);
    return authEntity;
  }

  async update(id: string, auth: Partial<Auth>): Promise<Auth> {
    await this.authRepository.update(id, auth);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.authRepository.delete(id);
  }
}
