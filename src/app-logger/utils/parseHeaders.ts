import { IncomingHttpHeaders } from 'http';

export const parseHeaders = (headers: IncomingHttpHeaders) => {
  return {
    location: headers.location,
    host: headers.host,
    connection: headers.connection,
    'user-agent': headers['user-agent'],
    authorization: headers.authorization,
    cookie: headers.cookie,
  };
};
