import { Type } from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';
import { AppLoggerObj } from './AppLoggerObj.type';

export type AppLoggerParams = {
  applyForRoutes?: (string | Type<any> | RouteInfo)[];
  convertLogObjToString?: boolean;
  setLoggerListener?: (data: AppLoggerObj) => void;
  // default: false
  logAllRequests?: boolean;
  // default: true
  logOnlyErrorRequests?: boolean;
  // default: true
  modifyErrorPrototype?: boolean;
};
