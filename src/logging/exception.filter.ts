import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoggingService } from './logging.service';

@Catch()
export class LoggingExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggingService: LoggingService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    this.loggingService.error(
      `Exception: ${JSON.stringify({
        message,
        status,
        timestamp: new Date().toISOString(),
        path: request.url,
      })}`,
    );

    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}
