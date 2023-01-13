import {
  ConsoleLogger,
  Inject,
  Injectable,
  LogLevel,
  Scope,
} from '@nestjs/common';
import { AppLoggerConstants } from './appLogger.constants';
import { AppLoggerModuleOptionsToken } from './appLogger.definition';
import { storage } from './storage';
import { AppLogger } from './types/AppLogger.type';
import { AppLoggerParams } from './types/AppLoggerParams.type';
import { AppLoggerRequest } from './types/AppLoggerRequest.type';
import { AppLoggerResponse } from './types/AppLoggerResponse.type';
import { parseRequest } from './utils/parseRequest';
import { parseResponse } from './utils/parseResponse';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLoggerService extends ConsoleLogger {
  private convertLogObjToString = false;

  constructor(
    @Inject(AppLoggerModuleOptionsToken)
    private readonly params: AppLoggerParams,
  ) {
    super();
    this.convertLogObjToString = !!this.params.convertLogObjToString;
  }

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

    let logLevel: LogLevel = 'debug';
    if (response.statusCode >= AppLoggerConstants.HTTP_CLIENT_ERROR_CODE) {
      logLevel = 'error';
    }

    this.assignLoggerResponse(parsedResponse);
    const message = `${response.statusCode} | [${request.method}] ${parsedRequest.url} - ${parsedResponse.requestTime}ms`;

    const logOnlyErrorRequests =
      logLevel === 'error' && this.params.logOnlyErrorRequests !== false;
    if (this.params.logAllRequests || logOnlyErrorRequests) {
      this.call(logLevel, message);
    }
  }

  private call(level: LogLevel, message: any) {
    try {
      const msg = this.buildLoggerMessage(level, message);
      const parsedMsg = this.convertLogObjToString ? JSON.stringify(msg) : msg;
      super[level](parsedMsg);
      this.params.setLoggerListener?.(msg);
    } catch (error) {
      this.logStackError(error);
    }
  }

  private buildLoggerMessage(level: LogLevel, message: any) {
    const loggerObj = {
      ...this.logger,
      msg: message,
      date: new Date().toISOString(),
      level: level.toUpperCase(),
      context: this.context,
    };

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
