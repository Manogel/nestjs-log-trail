import { ServerResponse } from 'http';

export interface AppLoggerResponse extends ServerResponse {
  responseData: any;
}
