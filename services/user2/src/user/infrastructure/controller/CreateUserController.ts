import { Body, Controller, Inject, Post } from '@nestjs/common';
import CreateUser from '../../domain/useCase/createUser/CreateUser';
import CreateUserRequest from '../../domain/useCase/createUser/CreateUserRequest';
import { CoreApiResponse } from '../../../shared/CoreApiResponse';
import CreateUserResponse from '../../domain/useCase/createUser/CreateUserResponse';

@Controller()
export default class CreateUserController {
  constructor(@Inject('CreateUser') private useCase: CreateUser) {}

  @Post('/user')
  async invoke(
    @Body() createUserRequest: CreateUserRequest,
  ): Promise<CoreApiResponse<CreateUserResponse>> {
    const userCreated = await this.useCase.execute(createUserRequest);

    return CoreApiResponse.success(userCreated);
  }
}
