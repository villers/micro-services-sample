import { Module, Provider } from '@nestjs/common';
import CreateUserController from './infrastructure/controller/CreateUserController';
// import InMemoryUserRepository from './infrastructure/repository/inMemory/InMemoryUserRepository';
import CreateUser from './domain/useCase/createUser/CreateUser';
import InSqlUserRepository from './infrastructure/repository/inSql/InSqlUserRepository';
import { Connection } from 'typeorm';

const persistenceProviders: Provider[] = [
  {
    provide: 'UserRepository',
    useFactory: (connection: Connection) =>
      connection.getCustomRepository(InSqlUserRepository),
    inject: [Connection],
  },
];

const useCaseProviders: Provider[] = [
  {
    provide: 'CreateUser',
    useFactory: (userRepository) => new CreateUser(userRepository),
    inject: ['UserRepository'],
  },
];

@Module({
  //imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [CreateUserController],
  providers: [...persistenceProviders, ...useCaseProviders],
})
export default class UserModule {}
