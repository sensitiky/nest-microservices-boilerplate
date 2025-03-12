import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Product, Auth } from '@api/common';

const postgresEntities = [User, Product, Auth];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'postgresConnection',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        username: configService.get<string>('DB_USERNAME'),
        database: configService.get<string>('DB_NAME'),
        password: configService.get<string>('DB_PASSWORD'),
        port: configService.get<number>('DB_PORT'),
        entities: postgresEntities,
        synchronize: true,
        logging: false,
        logger: 'advanced-console',
      }),
    }),
    TypeOrmModule.forFeature(postgresEntities, 'postgresConnection'),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
