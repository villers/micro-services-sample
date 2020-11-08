import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices/enums/transport.enum';
import { AppModule } from './app.module';
import {Logger} from "@nestjs/common";



async function bootstrap() {
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;

  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: port
    }
  })

  await app.startAllMicroservicesAsync();
  await app.listen(port,() => Logger.log(`Auth microservice running on port ${port}`));
}
bootstrap();
