import { Request } from 'express';
import { AppLogger } from './AppLogger.type';

export interface AppLoggerRequest extends Request {
  id: string;
  reqStartAt: number;
  logger: AppLogger;
}
