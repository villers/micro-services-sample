import { Controller, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ role: 'auth', cmd: 'ping' })
  ping(_: any) {
    return of('pong').pipe(delay(1000));
  }

  @MessagePattern({ role: 'auth', cmd: 'login' })
  async login(data: { username: string; password: string }) {
    Logger.log(data);
    const user = await this.authService.validateUser(
      data.username,
      data.password,
    );

    return this.authService.login(user);
  }

  @MessagePattern({ role: 'auth', cmd: 'check' })
  async isLoggedIn(data) {
    Logger.log(data);

    try {
      return this.authService.validateToken(data.jwt);
    } catch (e) {
      Logger.log(e);
      return false;
    }
  }

  @MessagePattern({ role: 'auth', cmd: 'get' })
  getUserData(data): any {
    try {
      return this.authService.getUserData(data.jwt);
    } catch (e) {
      Logger.log(e);
      return false;
    }
  }
}
