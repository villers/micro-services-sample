import IStatusRepository from '../../../../../src/status/domain/repository/IStatusRepository';
import GetStatus from '../../../../../src/status/domain/useCase/getStatus/getStatus';
import InMemoryStatusRepository from '../../../../../src/status/infrastructure/repository/inMemory/InMemoryStatusRepository';

describe('use case getStatus', () => {
  let statusRepository: IStatusRepository;
  let getStatusUseCase: GetStatus;

  beforeEach(() => {
    statusRepository = new InMemoryStatusRepository();
    getStatusUseCase = new GetStatus(statusRepository);
  });

  it('return a status', async () => {
    const result = await getStatusUseCase.execute();
    expect(result.status).toBeTruthy();
  });
});
