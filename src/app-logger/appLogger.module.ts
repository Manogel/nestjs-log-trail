import {
  Global,
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { NextFunction } from 'express';
import { AppLoggerConstants } from './appLogger.constants';
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
    {
      provide: AppLoggerConstants.PARAMS_PROVIDER_TOKEN,
      useValue: {
        applyForRoutes: [{ path: '*', method: RequestMethod.ALL }],
        convertLogObjToString: false,
      },
    },
  ],
  exports: [AppLoggerService],
})
export class AppLoggerModule implements NestModule {
  constructor(
    @Inject(AppLoggerConstants.PARAMS_PROVIDER_TOKEN)
    private readonly params: AppLoggerParams,
  ) {}

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
