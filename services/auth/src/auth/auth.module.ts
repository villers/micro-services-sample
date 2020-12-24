import { Logger, Module } from '@nestjs/common';
import {
  ClientProxyFactory,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import constants from './constants';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule,
    JwtModule.register({
      secret: constants.jwtSecret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    Logger,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: 'USER_CLIENT',
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
export class AuthModule {}
