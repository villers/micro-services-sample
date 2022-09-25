import CreateUser from '../../../../../src/user/domain/useCase/createUser/CreateUser';
import InMemoryUserRepository from '../../../../../src/user/infrastructure/repository/inMemory/InMemoryUserRepository';

describe('create a user', () => {
  it('can create a user', async () => {
    const StatusRepository = new InMemoryUserRepository();
    const createUserUseCase = new CreateUser(StatusRepository);

    const result = await createUserUseCase.execute({
      name: 'mickael',
      email: 'mickael@mickael.fr',
      password: 'password',
    });

    expect(result).toMatchObject({
      email: 'mickael@mickael.fr',
      id: 1,
      name: 'mickael',
    });
  });
});
