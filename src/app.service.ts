import { BadRequestException, Injectable } from '@nestjs/common';
import { AppLoggerService } from './app-logger/appLogger.service';

@Injectable()
export class AppService {
  constructor(private readonly logger: AppLoggerService) {
    this.logger.setContext(AppService.name);
  }
  getHello() {
    return { ok: 'Hello World!' };
  }

  getError() {
    this.logger.debug('Test debug error');
    throw new Error('Test error');
  }

  getBadRequest() {
    throw new BadRequestException('Bad request');
  }
}
