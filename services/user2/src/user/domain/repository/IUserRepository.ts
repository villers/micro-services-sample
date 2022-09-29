import User from '../model/user';
import CreateUserRequest from '../useCase/createUser/CreateUserRequest';

export default interface IUserRepository {
  createUser({ name, email, password }: CreateUserRequest): Promise<User>;
  exists(createUserRequest: CreateUserRequest): Promise<boolean>;
}
