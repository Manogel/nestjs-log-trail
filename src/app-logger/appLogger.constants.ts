import { RequestMethod } from '@nestjs/common';

export class AppLoggerConstants {
  static readonly FOR_ROUTES = [{ path: '*', method: RequestMethod.ALL }];
}
