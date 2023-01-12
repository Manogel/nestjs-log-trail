import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { AppLoggerRequest } from './types/AppLoggerRequest.type';
import { v4 as uuidv4 } from 'uuid';
import { parseRequest } from './utils/parseRequest';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  use(req: AppLoggerRequest, _res: Response, next: NextFunction) {
    const requestId = this.genRequestId(req);
    req.id = requestId;
    req.logger = {
      req: parseRequest(req),
    };

    next();
  }

  private genRequestId(req: AppLoggerRequest) {
    return req.id || uuidv4();
  }
}
