import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {
  ClientProxyFactory,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ClientsModule],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'AUTH_CLIENT',
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
  ],
})
export class UserModule {}
