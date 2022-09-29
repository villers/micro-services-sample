import GetStatusController from '../../../../src/status/infrastructure/controller/GetStatusController';
import InMemoryStatusRepository from '../../../../src/status/infrastructure/repository/inMemory/InMemoryStatusRepository';
import GetStatus from '../../../../src/status/domain/useCase/getStatus/getStatus';

describe('use case getStatus', () => {
  it('must return true', async () => {
    const repository = new InMemoryStatusRepository();
    const useCase = new GetStatus(repository);
    const controller = new GetStatusController(useCase);

    const result = await controller.invoke();

    expect(result).toMatchObject({
      code: 200,
      data: {
        status: true,
      },
      message: 'Success.',
    });
  });
});
