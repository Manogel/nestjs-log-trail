import { Type } from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';
import { AppLoggerObj } from './AppLoggerObj.type';

export type AppLoggerParams = {
  applyForRoutes?: (string | Type<any> | RouteInfo)[];
  convertLogObjToString?: boolean;
  setLoggerListener?: (data: AppLoggerObj) => void;
};
