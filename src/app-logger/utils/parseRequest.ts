import { AppLoggerRequest } from '../types/AppLoggerRequest.type';
import { parseHeaders } from './parseHeaders';

export const parseRequest = (req: AppLoggerRequest) => {
  const headers = parseHeaders(req.headers);
  return {
    id: req.id,
    fullUrl: `${headers.host}${req.url}`,
    hostname: req.hostname,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    url: req.url,
    originalUrl: req.originalUrl,
    baseUrl: req.baseUrl,
    headers,
  };
};
