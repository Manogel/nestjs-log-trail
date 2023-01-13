import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AppLoggerService } from './app-logger/appLogger.service';

@Controller()
export class AppController {
  constructor(
    private readonly logger: AppLoggerService,
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Get('/error')
  getError() {
    return this.appService.getError();
  }

  @Get('/bad-request')
  getBadRequest() {
    this.logger.assignExtraData({ extra: 'extra data' });
    return this.appService.getBadRequest();
  }
}
