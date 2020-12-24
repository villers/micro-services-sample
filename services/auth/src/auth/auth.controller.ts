import { Controller, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { JsonWebTokenError } from 'jsonwebtoken';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: Logger,
  ) {}

  @MessagePattern({ role: 'auth', cmd: 'ping' })
  ping(_: any) {
    return of('pong').pipe(delay(1000));
  }

  @MessagePattern({ role: 'auth', cmd: 'login' })
  async login(data: { username: string; password: string }) {
    this.logger.log(data);

    try {
      const user = await this.authService.validateUser(
        data.username,
        data.password,
      );

      if (user === null) {
        this.logger.log('invalid credential');
        return false;
      }

      return this.authService.login(user);
    } catch (e) {
      this.logger.error(e);
      return false;
    }
  }

  @MessagePattern({ role: 'auth', cmd: 'check' })
  async isLoggedIn({ jwt }: { jwt: string }) {
    this.logger.log(jwt);

    try {
      return this.authService.validateToken(jwt);
    } catch (e) {
      if (e instanceof JsonWebTokenError) {
        return false;
      }

      this.logger.error(e);
      return false;
    }
  }

  @MessagePattern({ role: 'auth', cmd: 'get' })
  getUserData({ jwt }: { jwt: string }): any {
    this.logger.log(jwt);

    try {
      this.authService.validateToken(jwt);

      return this.authService.getUserData(jwt);
    } catch (e) {
      if (e instanceof JsonWebTokenError) {
        return false;
      }

      this.logger.error(e);
      return false;
    }
  }
}
