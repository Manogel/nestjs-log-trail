import { AsyncLocalStorage } from 'async_hooks';
import { AppLogger } from './types/AppLogger.type';

export class AppLoggerStore {
  constructor(public logger: AppLogger) {}
}

export const storage = new AsyncLocalStorage<AppLoggerStore>();
