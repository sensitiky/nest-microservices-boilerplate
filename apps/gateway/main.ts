import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ConsoleLogger } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { TransformInterceptor, ErrorInterceptor } from '@api/config';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new ConsoleLogger('Gateway');
  const app = await NestFactory.create<NestFastifyApplication>(
    GatewayModule,
    new FastifyAdapter(),
  );
  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('NestJS Microservices API')
    .setDescription(
      'A modular and scalable API with microservices using hexagonal architecture. This API provides endpoints for authentication, user management, and product management.',
    )
    .setVersion('1.0')
    .addTag(
      'Authentication',
      'Endpoints for user authentication and session management',
    )
    .addTag('Users', 'Endpoints for user management')
    .addTag('Products', 'Endpoints for product management')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'list',
    },
  });

  app.enableCors({
    origin: ['*'],
    allowedHeaders: ['Authorization', 'content-type'],
    methods: ['POST', 'PUT', 'DELETE', 'GET', 'PATCH'],
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalInterceptors(new TransformInterceptor(), new ErrorInterceptor());

  const port = configService.get<string>('PORT') ?? 3000;
  await app.listen(port, '0.0.0.0');
  logger.log(`Gateway running on port ${port}`);
  logger.log(
    `Swagger documentation available at http://localhost:${port}/api/docs`,
  );
}

bootstrap();
