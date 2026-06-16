import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DatabaseModule } from '@api/config';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { AuthSessionTypeOrmRepository } from './infrastructure/persistence/repositories/auth-session.typeorm-repository';
import { AuthSessionOrmEntity } from './infrastructure/persistence/entities/auth-session.orm-entity';
import { TcpUserServiceClient } from './infrastructure/clients/tcp-user-service.client';
import { JwtTokenGenerator } from './infrastructure/jwt/jwt-token-generator';
import { LoginUseCase } from './application/use-cases/login/login.use-case';
import { RegisterUseCase } from './application/use-cases/register/register.use-case';
import { ValidateTokenUseCase } from './application/use-cases/validate-token/validate-token.use-case';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token/refresh-token.use-case';
import { LogoutUseCase } from './application/use-cases/logout/logout.use-case';
import {
  AuthSessionRepositorySymbol,
  UserServiceClientSymbol,
  TokenGeneratorSymbol,
} from './domain/symbols/auth.symbol';
import { IAuthSessionRepository } from './domain/ports/out/auth-session.repository.port';
import { IUserServiceClient } from './domain/ports/out/user-service-client.port';
import { ITokenGenerator } from './domain/ports/out/token-generator.port';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: '0.0.0.0',
            port: configService.get<number>('USER_TCP_PORT') ?? 4003,
          },
        }),
      },
    ]),
    DatabaseModule,
    TypeOrmModule.forFeature([AuthSessionOrmEntity], 'postgresConnection'),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: AuthSessionRepositorySymbol,
      useClass: AuthSessionTypeOrmRepository,
    },
    { provide: UserServiceClientSymbol, useClass: TcpUserServiceClient },
    { provide: TokenGeneratorSymbol, useClass: JwtTokenGenerator },
    {
      provide: LoginUseCase,
      useFactory: (
        repo: IAuthSessionRepository,
        client: IUserServiceClient,
        gen: ITokenGenerator,
      ) => new LoginUseCase(repo, client, gen),
      inject: [
        AuthSessionRepositorySymbol,
        UserServiceClientSymbol,
        TokenGeneratorSymbol,
      ],
    },
    {
      provide: RegisterUseCase,
      useFactory: (
        repo: IAuthSessionRepository,
        client: IUserServiceClient,
        gen: ITokenGenerator,
      ) => new RegisterUseCase(repo, client, gen),
      inject: [
        AuthSessionRepositorySymbol,
        UserServiceClientSymbol,
        TokenGeneratorSymbol,
      ],
    },
    {
      provide: ValidateTokenUseCase,
      useFactory: (gen: ITokenGenerator) => new ValidateTokenUseCase(gen),
      inject: [TokenGeneratorSymbol],
    },
    {
      provide: RefreshTokenUseCase,
      useFactory: (repo: IAuthSessionRepository, gen: ITokenGenerator) =>
        new RefreshTokenUseCase(repo, gen),
      inject: [AuthSessionRepositorySymbol, TokenGeneratorSymbol],
    },
    {
      provide: LogoutUseCase,
      useFactory: (repo: IAuthSessionRepository) => new LogoutUseCase(repo),
      inject: [AuthSessionRepositorySymbol],
    },
  ],
})
export class AuthModule {}
