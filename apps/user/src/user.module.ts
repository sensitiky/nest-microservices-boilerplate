import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './application/services/user.service';
import { UserController } from './infrastructure/controllers/user.controller';
import { UserEntity } from './infrastructure/entities/user.entity';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { DatabaseModule } from '@api/config';

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
    TypeOrmModule.forFeature([UserEntity], 'postgresConnection'),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
})
export class UserModule {}
