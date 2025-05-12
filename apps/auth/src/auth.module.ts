import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './application/services/auth.service';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { AuthRepository } from './infrastructure/repositories/auth.repository';
import { DatabaseModule } from '@api/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthFactoryService } from './application/services/auth-factory.service';

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
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: '0.0.0.0',
            port: configService.get<number>('USER_TCP_PORT') || 4003,
          },
        }),
      },
    ]),
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthFactoryService,
    {
      provide: 'IAuthRepository',
      useClass: AuthRepository,
    },
    { provide: 'IAuthService', useClass: AuthService },
  ],
})
export class AuthModule {}
