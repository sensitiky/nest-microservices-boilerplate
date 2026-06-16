import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '@api/config';
import { UserController } from './infrastructure/controllers/user.controller';
import { UserTypeOrmRepository } from './infrastructure/persistence/repositories/user.typeorm-repository';
import { UserOrmEntity } from './infrastructure/persistence/entities/user.orm-entity';
import { CreateUserUseCase } from './application/use-cases/create-user/create-user.use-case';
import { GetUserByIdUseCase } from './application/use-cases/get-user-by-id/get-user-by-id.use-case';
import { GetUserByEmailUseCase } from './application/use-cases/get-user-by-email/get-user-by-email.use-case';
import { GetAllUsersUseCase } from './application/use-cases/get-all-users/get-all-users.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user/update-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user/delete-user.use-case';
import { GetMeUseCase } from './application/use-cases/get-me/get-me.use-case';
import { UserRepositorySymbol } from './domain/symbols/user.symbol';
import { IUserRepository } from './domain/ports/out/user.repository.port';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    DatabaseModule,
    TypeOrmModule.forFeature([UserOrmEntity], 'postgresConnection'),
  ],
  controllers: [UserController],
  providers: [
    {
      provide: UserRepositorySymbol,
      useClass: UserTypeOrmRepository,
    },
    {
      provide: CreateUserUseCase,
      useFactory: (repo: IUserRepository) => new CreateUserUseCase(repo),
      inject: [UserRepositorySymbol],
    },
    {
      provide: GetUserByIdUseCase,
      useFactory: (repo: IUserRepository) => new GetUserByIdUseCase(repo),
      inject: [UserRepositorySymbol],
    },
    {
      provide: GetUserByEmailUseCase,
      useFactory: (repo: IUserRepository) => new GetUserByEmailUseCase(repo),
      inject: [UserRepositorySymbol],
    },
    {
      provide: GetAllUsersUseCase,
      useFactory: (repo: IUserRepository) => new GetAllUsersUseCase(repo),
      inject: [UserRepositorySymbol],
    },
    {
      provide: UpdateUserUseCase,
      useFactory: (repo: IUserRepository) => new UpdateUserUseCase(repo),
      inject: [UserRepositorySymbol],
    },
    {
      provide: DeleteUserUseCase,
      useFactory: (repo: IUserRepository) => new DeleteUserUseCase(repo),
      inject: [UserRepositorySymbol],
    },
    {
      provide: GetMeUseCase,
      useFactory: (repo: IUserRepository) => new GetMeUseCase(repo),
      inject: [UserRepositorySymbol],
    },
  ],
})
export class UserModule {}
