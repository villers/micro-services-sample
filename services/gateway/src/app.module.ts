import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { UserController } from './controller/user.controller';
import { AuthService } from './services/auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserService } from './services/user.service';
import { StatusController } from './controller/status.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SERVICE_AUTH',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 3000,
        },
      },
      {
        name: 'SERVICE_USER',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 4000,
        },
      },
    ]),
  ],
  controllers: [AuthController, UserController, StatusController],
  providers: [AuthService, UserService],
})
export class AppModule {}
