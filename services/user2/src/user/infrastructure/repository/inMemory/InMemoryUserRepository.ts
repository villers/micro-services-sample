import IUserRepository from '../../../domain/repository/IUserRepository';
import CreateUserRequest from '../../../domain/useCase/createUser/CreateUserRequest';
import User from '../../../domain/model/User';

export default class InMemoryUserRepository implements IUserRepository {
  users = [];
  auto_increment = 1;

  async createUser({
    name,
    email,
    password,
  }: CreateUserRequest): Promise<User> {
    const u = new User();
    u.id = this.auto_increment;
    u.name = name;
    u.email = email;
    u.password = password;

    this.users.push(u);

    this.auto_increment++;

    return u;
  }

  async exists(createUserRequest: CreateUserRequest): Promise<boolean> {
    return !!(await this.users.find(
      (u) => u.email === createUserRequest.email,
    ));
  }
}
