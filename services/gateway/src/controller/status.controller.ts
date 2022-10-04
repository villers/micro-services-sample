import { Controller, Get } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { delay, map } from 'rxjs/operators';
import { of, zip } from 'rxjs';

@Controller()
export class StatusController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('/status')
  status() {
    return of('ok');//.pipe(delay(1000));
  }

  @Get('/ping')
  ping() {
    return zip(this.authService.ping(), this.userService.ping()).pipe(
      map(([auth, user]) => ({
        auth,
        user,
      })),
    );
  }
}
