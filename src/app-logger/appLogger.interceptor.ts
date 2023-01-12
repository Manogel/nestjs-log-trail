import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AppLoggerService } from './appLogger.service';
import { AppLoggerRequest } from './types/AppLoggerRequest.type';
import { AppLoggerResponse } from './types/AppLoggerResponse.type';

@Injectable()
export class AppLoggerInterceptor implements NestInterceptor {
  constructor(private appLoggerService: AppLoggerService) {
    appLoggerService.setContext(AppLoggerInterceptor.name);
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<AppLoggerRequest>();
    req.reqStartAt = Date.now();
    this.requestListenerSetup(context);

    return next.handle().pipe(
      tap((response) => {
        this.setResponseData(context, response);
      }),
      catchError((error) => {
        this.appLoggerService.logStackError(error);
        this.setResponseData(context, error);

        return throwError(() => {
          return error;
        });
      }),
    );
  }

  private requestListenerSetup(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<AppLoggerRequest>();
    const endListener = () => {
      this.createLogRequest(context);
      req.removeAllListeners('end');
    };

    req.on('end', endListener);
  }

  private createLogRequest(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AppLoggerRequest>();
    const response = context.switchToHttp().getResponse<AppLoggerResponse>();
    this.appLoggerService.logRequest(request, response);
  }

  private setResponseData(context: ExecutionContext, responseData: any) {
    const response = context.switchToHttp().getResponse<AppLoggerResponse>();
    response.responseData = responseData;
  }
}
