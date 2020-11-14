import { Controller, Get } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { map } from 'rxjs/operators';
import { zip } from 'rxjs';

@Controller()
export class StatusController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

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
