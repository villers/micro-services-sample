import { Logger, Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { UserController } from './controller/user.controller';
import { AuthService } from './services/auth.service';
import {
  ClientProxyFactory,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { UserService } from './services/user.service';
import { StatusController } from './controller/status.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: !!process.env.PORT,
    }),
    ClientsModule,
  ],
  controllers: [AuthController, UserController, StatusController],
  providers: [
    AuthService,
    UserService,
    {
      provide: 'SERVICE_AUTH',
      useFactory: (configService: ConfigService) => {
        Logger.log(
          `auth service h:${configService.get<string>(
            'AUTH_SERVICE',
          )}:${configService.get<number>('AUTH_SERVICE_PORT')}`,
        );
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('AUTH_SERVICE'),
            port: configService.get<number>('AUTH_SERVICE_PORT'),
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'SERVICE_USER',
      useFactory: (configService: ConfigService) => {
        Logger.log(
          `user service h:${configService.get<string>(
            'USER_SERVICE',
          )}:${configService.get<number>('USER_SERVICE_PORT')}`,
        );
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('USER_SERVICE'),
            port: configService.get<number>('USER_SERVICE_PORT'),
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
