import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../guard/auth.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/auth/ping')
  ping() {
    return this.authService.ping();
  }

  @Post('/auth/login')
  login(@Body() user: { username: string; password: string }) {
    return this.authService.login(user);
  }

  @Post('/auth/register')
  register(
    @Body()
    user: {
      username: string;
      password: string;
      name: string;
      email: string;
    },
  ) {
    return this.authService.register(user);
  }

  @UseGuards(AuthGuard)
  @Get('/auth/me')
  user(@Request() req) {
    return this.authService.getUserData(
      req.headers['authorization']?.split(' ')[1],
    );
  }
}
