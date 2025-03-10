import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './application/services/auth.service';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { AuthEntity } from './infrastructure/entities/auth.entity';
import { AuthRepository } from './infrastructure/repositories/auth.repository';
import { DatabaseModule } from '@api/config';
import { UserRepository } from 'apps/user/src/infrastructure/repositories/user.repository';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([AuthEntity], 'postgresConnection'),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'IAuthRepository',
      useClass: AuthRepository,
    },
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
})
export class AuthModule {}
