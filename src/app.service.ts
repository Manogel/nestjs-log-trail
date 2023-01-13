import { Injectable } from '@nestjs/common';
import { AppLoggerService } from './app-logger/appLogger.service';

@Injectable()
export class AppService {
  constructor(private readonly logger: AppLoggerService) {
    this.logger.setContext(AppService.name);
  }
  getHello() {
    throw new Error('Test error');
    return { ok: 'Hello World!' };
  }
}
