import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';
import { User } from './user.entity';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ role: 'user', cmd: 'ping' })
  ping(_: any) {
    return of('pong').pipe(delay(1000));
  }

  @MessagePattern({ role: 'user', cmd: 'create' })
  async createUser(data) {
    return await this.userService.createUser(data);
  }

  @MessagePattern({ role: 'user', cmd: 'get' })
  getUser(data: { username: string }): Promise<User> {
    return this.userService.findOne({ username: data.username });
  }

  @MessagePattern({ role: 'user', cmd: 'greet' })
  async greet(): Promise<string> {
    return 'Greetings authenticated user';
  }
}
