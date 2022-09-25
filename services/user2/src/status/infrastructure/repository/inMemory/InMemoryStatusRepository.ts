import IStatusRepository from '../../../domain/repository/IStatusRepository';

export default class InMemoryStatusRepository implements IStatusRepository {
  status(): boolean {
    return true;
  }
}
