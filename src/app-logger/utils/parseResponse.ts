import { AppLoggerRequest } from '../types/AppLoggerRequest.type';
import { AppLoggerResponse } from '../types/AppLoggerResponse.type';

export const parseResponse = (
  res: AppLoggerResponse,
  req: AppLoggerRequest,
) => {
  const { statusCode, statusMessage } = res;
  const requestTime = Date.now() - req.reqStartAt;

  return {
    requestId: req.id,
    statusCode,
    statusMessage,
    requestTime,
    data: res.responseData,
  };
};
