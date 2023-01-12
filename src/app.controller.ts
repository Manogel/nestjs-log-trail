import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { AppLoggerService } from './app-logger/appLogger.service';

@Controller()
export class AppController {
  constructor(
    private readonly logger: AppLoggerService,
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(@Req() request: Request) {
    return this.appService.getHello();
  }
}
