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
        url: configService.get<string>('DATABASE_URL'),
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
