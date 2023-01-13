import { AppLogger } from './AppLogger.type';

export interface AppLoggerObj extends AppLogger {
  msg: string;
  date: string;
  level: string;
  req?: object;
  res?: object;
  extra?: object;
}
