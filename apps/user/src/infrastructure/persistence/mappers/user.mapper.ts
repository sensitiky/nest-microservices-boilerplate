import { User } from '../../../domain/aggregates/user.aggregate';
import { UserOrmEntity } from '../entities/user.orm-entity';

export class UserMapper {
  static toDomain(orm: UserOrmEntity): User {
    return User.reconstitute({
      id: orm.id,
      name: orm.name,
      email: orm.email,
      hashedPassword: orm.hashedPassword,
      avatar: orm.avatar,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toPersistence(domain: User): UserOrmEntity {
    const entity = new UserOrmEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.email = domain.email.value;
    entity.hashedPassword = domain.password.value;
    entity.avatar = domain.avatar;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
