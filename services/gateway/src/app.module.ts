import { Logger, Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { UserController } from './controller/user.controller';
import { AuthService } from './services/auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserService } from './services/user.service';
import { StatusController } from './controller/status.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: !!process.env.PORT,
    }),
    ClientsModule.registerAsync([
      {
        name: 'SERVICE_AUTH',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          Logger.log(
            `auth service h:${configService.get<string>(
              'AUTH_SERVICE',
            )}:${configService.get<number>('AUTH_SERVICE_PORT')}`,
          );
          return {
            transport: Transport.TCP,
            options: {
              host: configService.get<string>('AUTH_SERVICE'),
              port: configService.get<number>('AUTH_SERVICE_PORT'),
            },
          };
        },
      },
      {
        name: 'SERVICE_USER',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          Logger.log(
            `user service h:${configService.get<string>(
              'USER_SERVICE',
            )}:${configService.get<number>('USER_SERVICE_PORT')}`,
          );
          return {
            transport: Transport.TCP,
            options: {
              host: configService.get<string>('USER_SERVICE'),
              port: configService.get<number>('USER_SERVICE_PORT'),
            },
          };
        },
      },
    ]),
  ],
  controllers: [AuthController, UserController, StatusController],
  providers: [AuthService, UserService],
})
export class AppModule {}
