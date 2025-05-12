import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ProductModule } from './src/product.module';
import { ConsoleLogger } from '@nestjs/common';

async function bootstrap() {
  const logger = new ConsoleLogger('ProductMicroservice');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ProductModule,
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
    `Product microservice is running on port ${process.env.TCP_PORT ?? 4002}`,
  );
}

bootstrap();
