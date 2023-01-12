import { Injectable } from '@nestjs/common';
import { AppLoggerService } from './app-logger/appLogger.service';

@Injectable()
export class AppService {
  constructor(private readonly logger: AppLoggerService) {
    this.logger.setContext(AppService.name);
  }
  getHello() {
    return { ok: 'Hello World!' };
  }
}
