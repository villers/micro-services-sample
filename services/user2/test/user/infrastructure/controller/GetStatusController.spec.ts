import CreateUserController from '../../../../src/user/infrastructure/controller/CreateUserController';
import InMemoryUserRepository from '../../../../src/user/infrastructure/repository/inMemory/InMemoryUserRepository';
import CreateUser from '../../../../src/user/domain/useCase/createUser/CreateUser';

describe('use case create a user', () => {
  it('a user must be created and returned', async () => {
    const repository = new InMemoryUserRepository();
    const useCase = new CreateUser(repository);
    const controller = new CreateUserController(useCase);

    const result = await controller.invoke({
      name: 'name',
      email: 'email@email.fr',
      password: 'password',
    });

    expect(result).toMatchObject({
      code: 200,
      data: {
        email: 'email@email.fr',
        id: 1,
        name: 'name',
      },
      message: 'Success.',
    });
  });
});
