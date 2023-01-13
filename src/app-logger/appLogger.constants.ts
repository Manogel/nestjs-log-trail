import { RequestMethod } from '@nestjs/common';

export class AppLoggerConstants {
  static readonly PARAMS_PROVIDER_TOKEN = '@appLogger/params';
  static readonly FOR_ROUTES = [{ path: '*', method: RequestMethod.ALL }];
}
