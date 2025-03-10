import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UserModule } from './src/user.module';
import { ConsoleLogger } from '@nestjs/common';

async function bootstrap() {
  const logger = new ConsoleLogger('UserMicroservice');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: process.env.TCP_PORT ? parseInt(process.env.TCP_PORT) : 4002,
      },
    },
  );

  await app.listen();
  logger.log(
    `User microservice is running on port ${process.env.TCP_PORT || 4002}`,
  );
}

bootstrap();
