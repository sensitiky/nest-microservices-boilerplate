import { BaseEntity } from './base.entity';
import { Entity, Column } from 'typeorm';

@Entity('auth')
export class Auth extends BaseEntity {
  @Column()
  userId: string;

  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @Column()
  expiresAt: Date;
}
