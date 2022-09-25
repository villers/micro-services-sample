import { IsEmail, IsString } from 'class-validator';

export default class CreateUserRequest {
  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;
}
