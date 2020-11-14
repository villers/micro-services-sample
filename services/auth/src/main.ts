import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices/enums/transport.enum';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: port,
      },
    },
  );
  app.listen(() => Logger.log(`Auth microservice running on port ${port}`));
}
bootstrap();
