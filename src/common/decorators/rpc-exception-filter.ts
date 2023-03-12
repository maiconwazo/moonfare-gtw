import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { status } from '@grpc/grpc-js';
import { HttpAdapterHost } from '@nestjs/core';

export interface IRpcException {
  details: string;
  code: number;
}

@Catch()
export class RpcExceptionFilter implements ExceptionFilter {
  static HttpStatusCode: Record<number, number> = {
    [status.INVALID_ARGUMENT]: HttpStatus.BAD_REQUEST,
    [status.UNAUTHENTICATED]: HttpStatus.UNAUTHORIZED,
    [status.PERMISSION_DENIED]: HttpStatus.FORBIDDEN,
    [status.NOT_FOUND]: HttpStatus.NOT_FOUND,
    [status.ALREADY_EXISTS]: HttpStatus.CONFLICT,
    [status.ABORTED]: HttpStatus.GONE,
    [status.RESOURCE_EXHAUSTED]: HttpStatus.TOO_MANY_REQUESTS,
    [status.INTERNAL]: HttpStatus.INTERNAL_SERVER_ERROR,
    [status.UNIMPLEMENTED]: HttpStatus.NOT_IMPLEMENTED,
    [status.UNKNOWN]: HttpStatus.BAD_GATEWAY,
    [status.UNAVAILABLE]: HttpStatus.SERVICE_UNAVAILABLE,
    [status.DEADLINE_EXCEEDED]: HttpStatus.GATEWAY_TIMEOUT,
    [status.OUT_OF_RANGE]: HttpStatus.PAYLOAD_TOO_LARGE,
    [status.FAILED_PRECONDITION]: HttpStatus.PRECONDITION_FAILED,
  };

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(
    exception: IRpcException,
    host: ArgumentsHost,
  ): Observable<never> | void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception.code) {
      const codeTranslation = RpcExceptionFilter.HttpStatusCode[exception.code];
      if (codeTranslation) httpStatus = codeTranslation;
    }

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message: exception.details,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
