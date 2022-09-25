import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CoreApiResponse } from '../../CoreApiResponse';
import { Code } from '../../core/code/Code';
import { Exception } from '../../Exception/Exception';

@Catch()
export class NestHttpExceptionFilter implements ExceptionFilter {
  public catch(error: Error, host: ArgumentsHost): void {
    const request: Request = host.switchToHttp().getRequest();
    const response: Response = host.switchToHttp().getResponse<Response>();

    let errorResponse: CoreApiResponse<unknown> = CoreApiResponse.error(
      Code.INTERNAL_ERROR.code,
      error.message,
    );

    errorResponse = NestHttpExceptionFilter.handleNestError(
      error,
      errorResponse,
    );
    errorResponse = NestHttpExceptionFilter.handleCoreException(
      error,
      errorResponse,
    );

    const message: string =
      `Method: ${request.method}; ` +
      `Path: ${request.path}; ` +
      `Error: ${errorResponse.message}`;

    Logger.error(message);

    response.status(
      errorResponse.code >= 1000
        ? Code.BAD_REQUEST_ERROR.code
        : errorResponse.code,
    );
    response.json(errorResponse);
  }

  private static handleNestError(
    error: Error,
    errorResponse: CoreApiResponse<unknown>,
  ): CoreApiResponse<unknown> {
    if (error instanceof HttpException) {
      errorResponse = CoreApiResponse.error(
        error.getStatus(),
        error.message,
        null,
      );
    }
    if (error instanceof UnauthorizedException) {
      errorResponse = CoreApiResponse.error(
        Code.UNAUTHORIZED_ERROR.code,
        Code.UNAUTHORIZED_ERROR.message,
        null,
      );
    }

    return errorResponse;
  }

  private static handleCoreException(
    error: Error,
    errorResponse: CoreApiResponse<unknown>,
  ): CoreApiResponse<unknown> {
    if (error instanceof Exception) {
      errorResponse = CoreApiResponse.error(
        error.code,
        error.message,
        error.data,
      );
    }

    return errorResponse;
  }
}
