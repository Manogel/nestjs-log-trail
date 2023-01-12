import { ConsoleLogger, Injectable, LogLevel, Scope } from '@nestjs/common';
import { storage } from './storage';
import { AppLogger } from './types/AppLogger.type';
import { AppLoggerRequest } from './types/AppLoggerRequest.type';
import { AppLoggerResponse } from './types/AppLoggerResponse.type';
import { parseRequest } from './utils/parseRequest';
import { parseResponse } from './utils/parseResponse';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLoggerService extends ConsoleLogger {
  private convertToStringMessage = false;

  logStackError(error: Error) {
    const errorMessage = error.stack || error.message;
    this.error(errorMessage);
  }

  log(message: string) {
    this.call('log', message);
  }

  error(message: string) {
    this.call('error', message);
  }

  warn(message: string) {
    this.call('warn', message);
  }

  debug(message: string) {
    this.call('debug', message);
  }

  verbose(message: string) {
    this.call('verbose', message);
  }

  logRequest(request: AppLoggerRequest, response: AppLoggerResponse) {
    const parsedRequest = parseRequest(request);
    const parsedResponse = parseResponse(response, request);

    this.assignLoggerResponse(parsedResponse);
    const message = `${response.statusCode} | [${request.method}] ${parsedRequest.url} - ${parsedResponse.requestTime}ms`;

    this.call('log', message);
  }

  private call(level: LogLevel, message: any) {
    const msg = this.buildLoggerMessage(message);
    super[level](msg);
  }

  private buildLoggerMessage(message: any) {
    const loggerObj = {
      ...this.logger,
      msg: message,
    };

    if (this.convertToStringMessage) {
      return JSON.stringify(loggerObj);
    }

    return loggerObj;
  }

  private assignLoggerResponse(response: object) {
    const store = this.getStore();
    store.logger.res = response;
  }

  public assignExtraData(extraFields: object) {
    const store = this.getStore();
    const buildExtraFields = Object.assign(
      store.logger.extra || {},
      extraFields,
    );
    store.logger.extra = buildExtraFields;
  }

  private getStore() {
    const store = storage.getStore();
    if (!store) {
      throw new Error(
        `${AppLoggerService.name}: unable to assign extra fields out of request scope`,
      );
    }
    return store;
  }

  public get logger(): AppLogger {
    return storage.getStore()?.logger || {};
  }
}
