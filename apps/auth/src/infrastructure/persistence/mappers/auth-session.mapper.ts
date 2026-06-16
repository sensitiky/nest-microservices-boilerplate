import { AuthSession } from '../../../domain/aggregates/auth-session.aggregate';
import { AuthSessionOrmEntity } from '../entities/auth-session.orm-entity';

export class AuthSessionMapper {
  static toDomain(orm: AuthSessionOrmEntity): AuthSession {
    return AuthSession.reconstitute({
      id: orm.id,
      userId: orm.userId,
      accessToken: orm.accessToken,
      refreshToken: orm.refreshToken,
      expiresAt: orm.expiresAt,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toPersistence(domain: AuthSession): AuthSessionOrmEntity {
    const entity = new AuthSessionOrmEntity();
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
