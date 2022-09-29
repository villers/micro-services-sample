import { Module, Provider } from '@nestjs/common';
import GetStatusController from './infrastructure/controller/GetStatusController';
import InMemoryStatusRepository from './infrastructure/repository/inMemory/InMemoryStatusRepository';
import GetStatus from './domain/useCase/getStatus/getStatus';

const persistenceProviders: Provider[] = [
  {
    provide: 'StatusRepository',
    useClass: InMemoryStatusRepository,
  },
];

const useCaseProviders: Provider[] = [
  {
    provide: 'GetStatus',
    useFactory: (statusRepository) => new GetStatus(statusRepository),
    inject: ['StatusRepository'],
  },
];

@Module({
  imports: [],
  controllers: [GetStatusController],
  providers: [...persistenceProviders, ...useCaseProviders],
})
export default class StatusModule {}
