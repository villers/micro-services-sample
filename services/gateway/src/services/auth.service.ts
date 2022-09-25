import { Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, map, timeout } from 'rxjs/operators';
import { lastValueFrom, throwError, TimeoutError } from 'rxjs';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('SERVICE_AUTH') private readonly clientServiceAuth: ClientProxy,
    private readonly userService: UserService,
  ) {}

  ping() {
    const startTs = Date.now();
    const pattern = { role: 'auth', cmd: 'ping' };
    const payload = {};

    return this.clientServiceAuth
      .send<string>(pattern, payload)
      .pipe(
        map((message: string) => ({ message, duration: Date.now() - startTs })),
      );
  }

  async login(payload: { username: string; password: string }) {
    const pattern = { role: 'auth', cmd: 'login' };

    return lastValueFrom(
      this.clientServiceAuth.send<string>(pattern, payload).pipe(
        timeout(5000),
        catchError((err) => {
          if (err instanceof TimeoutError) {
            return throwError(() => new RequestTimeoutException());
          }
          return throwError(err);
        }),
      ),
    );
  }

  async register(data) {
    return await this.userService.create(data);
  }

  async getUserData(jwt: string) {
    return lastValueFrom(
      this.clientServiceAuth.send({ role: 'auth', cmd: 'get' }, { jwt }).pipe(
        timeout(5000),
        catchError((err) => {
          if (err instanceof TimeoutError) {
            return throwError(() => new RequestTimeoutException());
          }
          return throwError(err);
        }),
      ),
    );
  }
}
