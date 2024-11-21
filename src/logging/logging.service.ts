import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggingService {
  private readonly logger = new Logger('AppLogger');
  private readonly logDir: string;
  private readonly errorLogFile: string;
  private readonly combinedLogFile: string;

  constructor() {
    this.logDir = path.resolve(__dirname, '../logs');
    this.errorLogFile = path.join(this.logDir, 'error.log');
    this.combinedLogFile = path.join(this.logDir, 'combined.log');

    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir);
    }

    [this.errorLogFile, this.combinedLogFile].forEach((filePath) => {
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '');
      }
    });

    this.info('Logging service initialized');
    this.error('Test error log');
  }

  private writeToFile(filePath: string, message: string) {
    const logMessage = `${new Date().toISOString()} - ${message}\n`;
    fs.appendFileSync(filePath, logMessage, { encoding: 'utf8' });
  }

  log(message: string) {
    this.logger.log(message);
    this.writeToFile(this.combinedLogFile, `[LOG] ${message}`);
  }

  error(message: string, trace?: string) {
    this.logger.error(message, trace);
    this.writeToFile(this.errorLogFile, `[ERROR] ${message} ${trace || ''}`);
  }

  warn(message: string) {
    this.logger.warn(message);
    this.writeToFile(this.combinedLogFile, `[WARN] ${message}`);
  }

  debug(message: string) {
    this.logger.debug(message);
    this.writeToFile(this.combinedLogFile, `[DEBUG] ${message}`);
  }

  info(message: string) {
    this.logger.log(message);
    this.writeToFile(this.combinedLogFile, `[INFO] ${message}`);
  }
}