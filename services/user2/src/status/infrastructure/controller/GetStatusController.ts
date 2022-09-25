import { Controller, Get, Inject } from '@nestjs/common';
import GetStatus from '../../domain/useCase/getStatus/getStatus';
import { CoreApiResponse } from '../../../shared/CoreApiResponse';
import GetStatusResponse from '../../domain/useCase/getStatus/getStatusResponse';

@Controller()
export default class GetStatusController {
  constructor(@Inject('GetStatus') private useCase: GetStatus) {}

  @Get('/status')
  async invoke(): Promise<CoreApiResponse<GetStatusResponse>> {
    const status = await this.useCase.execute();

    return CoreApiResponse.success(status);
  }
}
