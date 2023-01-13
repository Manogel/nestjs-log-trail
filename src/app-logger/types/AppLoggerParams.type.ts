import { Type } from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';

export type AppLoggerParams = {
  applyForRoutes?: (string | Type<any> | RouteInfo)[];
  convertLogObjToString?: boolean;
};
