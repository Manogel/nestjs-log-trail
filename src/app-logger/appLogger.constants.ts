import { RequestMethod } from '@nestjs/common';

export class AppLoggerConstants {
  static readonly FOR_ROUTES = [{ path: '*', method: RequestMethod.ALL }];
  static readonly HTTP_CLIENT_ERROR_CODE = 400;
}
