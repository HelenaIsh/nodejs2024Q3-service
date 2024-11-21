import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly loggingService: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, url, body, query } = req;
    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;
      this.loggingService.info(
        `Request: ${method} ${url}, Query: ${JSON.stringify(
          query,
        )}, Body: ${JSON.stringify(
          body,
        )} | Response: ${statusCode} (${duration}ms)`,
      );
    });

    next();
  }
}
