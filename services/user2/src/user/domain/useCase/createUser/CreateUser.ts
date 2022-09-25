import CreateUserRequest from './CreateUserRequest';
import IUserRepository from '../../repository/IUserRepository';
import CreateUserResponse from './CreateUserResponse';
import { CoreAssert } from '../../../../shared/CoreAssert';
import { Code } from '../../../../shared/core/code/Code';
import { Exception } from '../../../../shared/Exception/Exception';

export default class CreateUser {
  constructor(private repository: IUserRepository) {}

  async execute(
    createUserRequest: CreateUserRequest,
  ): Promise<CreateUserResponse> {
    const doesUserExist: boolean = await this.repository.exists(
      createUserRequest,
    );

    CoreAssert.isFalse(
      doesUserExist,
      Exception.new({
        code: Code.ENTITY_ALREADY_EXISTS_ERROR,
        overrideMessage: 'User already exists.',
      }),
    );

    const user = await this.repository.createUser(createUserRequest);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
