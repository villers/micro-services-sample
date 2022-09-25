import IUserRepository from '../../../domain/repository/IUserRepository';
import CreateUserRequest from '../../../domain/useCase/createUser/CreateUserRequest';
import User from '../../../domain/model/User';
import { UserEntity } from '../../entity/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { UserMapper } from '../../mapper/user.mapper';

@EntityRepository(UserEntity)
export default class InSqlUserRepository
  extends Repository<UserEntity>
  implements IUserRepository {
  async createUser({
    name,
    email,
    password,
  }: CreateUserRequest): Promise<User> {
    const user = await this.insert({
      name,
      email,
      password,
    });

    return UserMapper.toDomainEntity(user.raw);
  }

  async exists(createUserRequest: CreateUserRequest): Promise<boolean> {
    const user = await this.findOne({
      email: createUserRequest.email,
    });

    return user !== undefined;
  }
}
