import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthModule } from './src/auth.module';
import { ConsoleLogger } from '@nestjs/common';

async function bootstrap() {
  const logger = new ConsoleLogger('AuthMicroservice');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: process.env.TCP_PORT ? parseInt(process.env.TCP_PORT) : 4001,
      },
    },
  );

  await app.listen();
  logger.log(
    `Auth microservice is running on port ${process.env.TCP_PORT || 4001}`,
  );
}

bootstrap();
