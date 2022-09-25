import User from '../../domain/model/User';
import { UserEntity } from '../entity/user.entity';

export class UserMapper {
  public static toOrmEntity(domainUser: User): UserEntity {
    const ormUser: UserEntity = new UserEntity();

    ormUser.id = domainUser.id;
    ormUser.name = domainUser.name;
    ormUser.email = domainUser.email;
    ormUser.password = domainUser.password;

    return ormUser;
  }

  public static toOrmEntities(domainUsers: User[]): UserEntity[] {
    return domainUsers.map((domainUser) => this.toOrmEntity(domainUser));
  }

  public static toDomainEntity(ormUser: UserEntity): User {
    return {
      id: ormUser.id,
      name: ormUser.name,
      email: ormUser.email,
      password: ormUser.password,
    };
  }

  public static toDomainEntities(ormUsers: UserEntity[]): User[] {
    return ormUsers.map((ormUser) => this.toDomainEntity(ormUser));
  }
}
