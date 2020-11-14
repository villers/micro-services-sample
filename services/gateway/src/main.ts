import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

const port = process.env.PORT ? Number(process.env.PORT) : 2000;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.listen(port, '0.0.0.0', () =>
    Logger.log(`Gateway microservice running on port ${port}`),
  );
}
bootstrap();
