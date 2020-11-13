import { Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, map, timeout } from 'rxjs/operators';
import { TimeoutError } from 'rxjs/internal/util/TimeoutError';
import { throwError } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @Inject('SERVICE_USER') private readonly clientServiceUser: ClientProxy,
  ) {}

  ping() {
    const startTs = Date.now();
    const pattern = { role: 'user', cmd: 'ping' };
    const payload = {};

    return this.clientServiceUser
      .send<string>(pattern, payload)
      .pipe(
        map((message: string) => ({ message, duration: Date.now() - startTs })),
      );
  }

  async create(data) {
    return await this.clientServiceUser
      .send({ role: 'user', cmd: 'create' }, data)
      .pipe(
        timeout(15000),
        catchError((err) => {
          if (err instanceof TimeoutError) {
            return throwError(new RequestTimeoutException());
          }
          return throwError(err);
        }),
      )
      .toPromise();
  }
}
