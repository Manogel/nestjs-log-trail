import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { NextFunction } from 'express';
import { AppLoggerInterceptor } from './appLogger.interceptor';
import { AppLoggerMiddleware } from './appLogger.middleware';
import { AppLoggerService } from './appLogger.service';
import { AppLoggerStore, storage } from './storage';
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
export class AppLoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const DEFAULT_ROUTES = [{ path: '*', method: RequestMethod.ALL }];

    consumer.apply(...this.buildLoggerMiddlers()).forRoutes(...DEFAULT_ROUTES);
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
