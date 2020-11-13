import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

const port = process.env.PORT ? Number(process.env.PORT) : 2000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(port, () =>
    Logger.log(`Gateway microservice running on port ${port}`),
  );
}
bootstrap();
