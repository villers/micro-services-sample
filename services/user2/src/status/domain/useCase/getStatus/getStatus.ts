import IStatusRepository from '../../repository/IStatusRepository';
import GetStatusResponse from './getStatusResponse';

export default class GetStatus {
  constructor(private repositoryService: IStatusRepository) {}

  async execute(): Promise<GetStatusResponse> {
    return { status: this.repositoryService.status() };
  }
}
