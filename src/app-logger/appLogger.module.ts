import {
  Global,
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { NextFunction } from 'express';
import { AppLoggerConstants } from './appLogger.constants';
import {
  AppLoggerModuleClass,
  AppLoggerModuleOptionsToken,
} from './appLogger.definition';
import { AppLoggerInterceptor } from './appLogger.interceptor';
import { AppLoggerMiddleware } from './appLogger.middleware';
import { AppLoggerService } from './appLogger.service';
import { AppLoggerStore, storage } from './storage';
import { AppLoggerParams } from './types/AppLoggerParams.type';
import { AppLoggerRequest } from './types/AppLoggerRequest.type';

@Global()
@Module({
  providers: [
    AppLoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AppLoggerInterceptor,
    },
  ],
  exports: [AppLoggerService],
})
export class AppLoggerModule
  extends AppLoggerModuleClass
  implements NestModule
{
  constructor(
    @Inject(AppLoggerModuleOptionsToken)
    private params: AppLoggerParams,
  ) {
    super();
  }

  configure(consumer: MiddlewareConsumer) {
    const { applyForRoutes = AppLoggerConstants.FOR_ROUTES } = this.params;
    consumer.apply(...this.buildLoggerMiddlers()).forRoutes(...applyForRoutes);
  }

  private buildLoggerMiddlers() {
    return [AppLoggerMiddleware, this.buildLoggerOnStorageMiddleware];
  }

  private buildLoggerOnStorageMiddleware(
    req: AppLoggerRequest,
    _res: Response,
    next: NextFunction,
  ) {
    const logger = req.logger;

    storage.run(new AppLoggerStore(logger), next, undefined);
  }
}
