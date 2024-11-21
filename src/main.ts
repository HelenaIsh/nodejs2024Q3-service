import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import 'dotenv/config';
import { LoggingService } from './logging/logging.service';
import { LoggingExceptionFilter } from './logging/exception.filter';

const PORT = process.env.PORT;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const loggingService = app.get(LoggingService);
  app.useGlobalFilters(new LoggingExceptionFilter(loggingService));
  process.on('uncaughtException', (err) => {
    loggingService.error(`Uncaught Exception: ${err.message}`, err.stack);
  });
  process.on('unhandledRejection', (reason) => {
    loggingService.error(`Unhandled Rejection: ${reason}`);
  });
  process.on('exit', () => {
    this.logger.end();
  });
  await app.listen(PORT);
}
bootstrap();
