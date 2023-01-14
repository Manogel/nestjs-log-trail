<h1 align="center">
@manogel/nestjs-log-trail
</h1>

<h2 align="center">
Provides logs anywhere for your application NestJs with request context.
</h2>

# Motivation


For a long time, I was frustrated with errors in production applications. My time has always invested a lot of working time trying to understand why the frontend was not behaving correctly with unknown errors in the backend and at the same time many problems persist in the backend and go unnoticed, either because it was developed by a junior team or the code review failed.

This package implements a custom logger to allow quick and easy detection of problems, mainly in production applications.

Another motivator is to allow access to logs triggered by the system and use this information to save in a database or even alert other systems such as Discord, Slack, etc.


# Features

- Log every request/response errors automatically
- Log every request/response if configured
- Log in JSON or stringified JSON
- Bind extra informations anywhere application layer for more details in your logs
- Setup a logger listener for more control with your logs

# Index

- [Installation](#Installation)
- [Getting Started](#Getting-Started)
- [Example: Saving logs to the database](#example-saving-logs-to-the-database)
- [Common questions](#common-questions)
- [I need your help](#common-questions)

# Installation

```bash
npm i @manogel/nestjs-log-trail
```

or

```bash
yarn add @manogel/nestjs-log-trail
```

# Getting Started

### Default object configuration

```typescript
AppLoggerModule.register({
    applyForRoutes: [{ path: '*', method: RequestMethod.ALL }],
    convertLogObjToString: false,
    setLoggerListener: undefined,
    logAllRequests: false,
    logOnlyErrorRequests: true,
    modifyErrorPrototype: true,
  })
```

## Default configuration with register

`Update app.module.ts with:`

```typescript
import { AppLoggerModule } from '@manogel/nestjs-log-trail';

@Module({
  imports: [
    AppLoggerModule.register({})
  ],
})
```

## Default configuration with registerAsync

`Update app.module.ts with:`

```typescript
import { AppLoggerModule } from '@manogel/nestjs-log-trail';

@Module({
  imports: [
    AppLoggerModule.registerAsync({
      imports: [],
      inject: [],
      useFactory() {
        return {};
      },
    }),
  ],
})
```
# Example: Saving logs to the database
See source code in [src](/src/) (NestJs, Prisma with SQLite)

`app.module.ts`
```typescript
@Module({
  imports: [
    PrismaModule,
    AppLoggerModule.registerAsync({
      useFactory: (prismaService: PrismaService) => {
        return {
          convertLogObjToString: false,
          async setLoggerListener(data) {
            await prismaService.applicationLogger.create({
              data: {
                level: data.level,
                msg: data.msg,
                context: data.context,
                date: data.date,
                req: JSON.stringify(data.req),
                res: JSON.stringify(data.res),
                extra: JSON.stringify(data.extra),
              },
              select: { id: true },
            });
          },
        };
      },
      inject: [PrismaService],
      imports: [PrismaModule],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

`app.service.ts`
```typescript
import { BadRequestException, Injectable } from '@nestjs/common';
import { AppLoggerService } from '@manogel/nestjs-log-trail';

@Injectable()
export class AppService {
  constructor(private readonly logger: AppLoggerService) {
    this.logger.setContext(AppService.name);
  }

  getError() {
    this.logger.debug('Test debug error');
    throw new Error('Test error');
  }

  getBadRequest() {
    throw new BadRequestException('Bad request');
  }
}
```

`app.controller.ts`
```typescript
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AppLoggerService } from '@manogel/nestjs-log-trail';

@Controller()
export class AppController {
  constructor(
    private readonly logger: AppLoggerService,
    private readonly appService: AppService,
  ) {}

  @Get('/error')
  getError() {
    this.logger.assignExtraData({
      userId: 'userFromRequest',
    });
    return this.appService.getError();
  }

  @Get('/bad-request')
  getBadRequest() {
    this.logger.assignExtraData({ extra: 'extra data' });
    return this.appService.getBadRequest();
  }
}
```

## Output

<details>
<summary><b>Request to /error:</b></summary>

```sh
[Nest] 52901  - 14/01/2023 18:04:26   DEBUG [AppService] Object:
{
  "req": {
    "id": "3340744a-402e-4414-a346-6cfd08572200",
    "fullUrl": "localhost:3000/error",
    "hostname": "localhost",
    "method": "GET",
    "body": {},
    "params": {
      "0": "error"
    },
    "query": {},
    "url": "/error",
    "originalUrl": "/error",
    "baseUrl": "",
    "headers": {
      "host": "localhost:3000",
      "connection": "close",
      "user-agent": "vscode-restclient"
    }
  },
  "extra": {
    "userId": "userFromRequest"
  },
  "msg": "Test debug error",
  "date": "2023-01-14T21:04:26.868Z",
  "level": "DEBUG",
  "context": "AppService"
}

[Nest] 52901  - 14/01/2023 18:04:26   ERROR [AppLoggerInterceptor] Object:
{
  "req": {
    "id": "3340744a-402e-4414-a346-6cfd08572200",
    "fullUrl": "localhost:3000/error",
    "hostname": "localhost",
    "method": "GET",
    "body": {},
    "params": {
      "0": "error"
    },
    "query": {},
    "url": "/error",
    "originalUrl": "/error",
    "baseUrl": "",
    "headers": {
      "host": "localhost:3000",
      "connection": "close",
      "user-agent": "vscode-restclient"
    }
  },
  "extra": {
    "userId": "userFromRequest"
  },
  "msg": "Error: Test error\n    at AppService.getError (/Users/manogel/projects/nest-log-trail/src/app.service.ts:16:11)\n    at AppController.getError (/Users/manogel/projects/nest-log-trail/src/app.controller.ts:23:28)\n    at /Users/manogel/projects/nest-log-trail/node_modules/@nestjs/core/router/router-execution-context.js:38:29\n    at InterceptorsConsumer.transformDeferred (/Users/manogel/projects/nest-log-trail/node_modules/@nestjs/core/interceptors/interceptors-consumer.js:31:33)\n    at /Users/manogel/projects/nest-log-trail/node_modules/@nestjs/core/interceptors/interceptors-consumer.js:15:53\n    at Observable._subscribe (/Users/manogel/projects/nest-log-trail/node_modules/rxjs/src/internal/observable/defer.ts:55:15)\n    at Observable._trySubscribe (/Users/manogel/projects/nest-log-trail/node_modules/rxjs/src/internal/Observable.ts:244:19)\n    at /Users/manogel/projects/nest-log-trail/node_modules/rxjs/src/internal/Observable.ts:234:18\n    at Object.errorContext (/Users/manogel/projects/nest-log-trail/node_modules/rxjs/src/internal/util/errorContext.ts:29:5)\n    at Observable.subscribe (/Users/manogel/projects/nest-log-trail/node_modules/rxjs/src/internal/Observable.ts:220:5)",
  "date": "2023-01-14T21:04:26.892Z",
  "level": "ERROR",
  "context": "AppLoggerInterceptor"
}
[AppLoggerInterceptor] Object:
{
  "req": {
    "id": "3340744a-402e-4414-a346-6cfd08572200",
    "fullUrl": "localhost:3000/error",
    "hostname": "localhost",
    "method": "GET",
    "body": {},
    "params": {
      "0": "error"
    },
    "query": {},
    "url": "/error",
    "originalUrl": "/error",
    "baseUrl": "",
    "headers": {
      "host": "localhost:3000",
      "connection": "close",
      "user-agent": "vscode-restclient"
    }
  },
  "extra": {
    "userId": "userFromRequest"
  },
  "res": {
    "requestId": "3340744a-402e-4414-a346-6cfd08572200",
    "statusCode": 500,
    "statusMessage": "Internal Server Error",
    "requestTime": 36,
    "data": {
      "stack": "Error: Test error\n    at AppService.getError (/Users/manogel/projects/nest-log-trail/src/app.service.ts:16:11)\n    at AppController.getError (/Users/manogel/projects/nest-log-trail/src/app.controller.ts:23:28)\n    at /Users/manogel/projects/nest-log-trail/node_modules/@nestjs/core/router/router-execution-context.js:38:29\n    at InterceptorsConsumer.transformDeferred (/Users/manogel/projects/nest-log-trail/node_modules/@nestjs/core/interceptors/interceptors-consumer.js:31:33)\n    at /Users/manogel/projects/nest-log-trail/node_modules/@nestjs/core/interceptors/interceptors-consumer.js:15:53\n    at Observable._subscribe (/Users/manogel/projects/nest-log-trail/node_modules/rxjs/src/internal/observable/defer.ts:55:15)\n    at Observable._trySubscribe (/Users/manogel/projects/nest-log-trail/node_modules/rxjs/src/internal/Observable.ts:244:19)\n    at /Users/manogel/projects/nest-log-trail/node_modules/rxjs/src/internal/Observable.ts:234:18\n    at Object.errorContext (/Users/manogel/projects/nest-log-trail/node_modules/rxjs/src/internal/util/errorContext.ts:29:5)\n    at Observable.subscribe (/Users/manogel/projects/nest-log-trail/node_modules/rxjs/src/internal/Observable.ts:220:5)",
      "message": "Test error"
    }
  },
  "msg": "500 | [GET] /error - 36ms",
  "date": "2023-01-14T21:04:26.900Z",
  "level": "ERROR",
  "context": "AppLoggerInterceptor"
}
```
</details>

<details>
<summary><b>Request to /bad-request:</b></summary>

```sh
[Nest] 52901  - 14/01/2023 18:06:49   ERROR [AppLoggerInterceptor] Object:
{
  "req": {
    "id": "d80fc2ee-83d1-44b2-b21c-d2170040c804",
    "fullUrl": "localhost:3000/bad-request",
    "hostname": "localhost",
    "method": "GET",
    "body": {},
    "params": {
      "0": "bad-request"
    },
    "query": {},
    "url": "/bad-request",
    "originalUrl": "/bad-request",
    "baseUrl": "",
    "headers": {
      "host": "localhost:3000",
      "connection": "close",
      "user-agent": "vscode-restclient"
    }
  },
  "extra": {
    "extra": "extra data"
  },
  "msg": "BadRequestException: Bad request\n    at AppService.getBadRequest (/Users/manogel/projects/nest-log-trail/src/app.service.ts:20:11)\n    at AppController.getBadRequest (/Users/manogel/projects/nest-log-trail/src/app.controller.ts:29:28)\n    at /Users/manogel/projects/nest-log-trail/node_modules/@nestjs/core/router/router-execution-context.js:38:29\n    at InterceptorsConsumer.transformDeferred (/Users/manogel/projects/nest-log-trail/node_modules/@nestjs/core/interceptors/interceptors-consumer.js:31:33)\n    at /Users/manogel/projects/nest-log-trail/node_modules/@nestjs/core/interceptors/interceptors-consumer.js:15:53\n    at Observable._subscribe (/Users/manogel/projects/nest-log-trail/node_modules/rxjs/src/internal/observable/defer.ts:55:15)\n    at Observable._trySubscribe (/Users/manogel/projects/nest-log-trail/node_modules/rxjs/src/internal/Observable.ts:244:19)\n    at /Users/manogel/projects/nest-log-trail/node_modules/rxjs/src/internal/Observable.ts:234:18\n    at Object.errorContext (/Users/manogel/projects/nest-log-trail/node_modules/rxjs/src/internal/util/errorContext.ts:29:5)\n    at Observable.subscribe (/Users/manogel/projects/nest-log-trail/node_modules/rxjs/src/internal/Observable.ts:220:5)",
  "date": "2023-01-14T21:06:49.312Z",
  "level": "ERROR",
  "context": "AppLoggerInterceptor"
}

[Nest] 52901  - 14/01/2023 18:06:49   ERROR [AppLoggerInterceptor] Object:
{
  "req": {
    "id": "d80fc2ee-83d1-44b2-b21c-d2170040c804",
    "fullUrl": "localhost:3000/bad-request",
    "hostname": "localhost",
    "method": "GET",
    "body": {},
    "params": {
      "0": "bad-request"
    },
    "query": {},
    "url": "/bad-request",
    "originalUrl": "/bad-request",
    "baseUrl": "",
    "headers": {
      "host": "localhost:3000",
      "connection": "close",
      "user-agent": "vscode-restclient"
    }
  },
  "extra": {
    "extra": "extra data"
  },
  "res": {
    "requestId": "d80fc2ee-83d1-44b2-b21c-d2170040c804",
    "statusCode": 400,
    "statusMessage": "Bad Request",
    "requestTime": 9,
    "data": {
      "stack": "BadRequestException: Bad request\n    at AppService.getBadRequest (/Users/manogel/projects/nest-log-trail/src/app.service.ts:20:11)\n    at AppController.getBadRequest (/Users/manogel/projects/nest-log-trail/src/app.controller.ts:29:28)\n    at /Users/manogel/projects/nest-log-trail/node_modules/@nestjs/core/router/router-execution-context.js:38:29\n    at InterceptorsConsumer.transformDeferred (/Users/manogel/projects/nest-log-trail/node_modules/@nestjs/core/interceptors/interceptors-consumer.js:31:33)\n    at /Users/manogel/projects/nest-log-trail/node_modules/@nestjs/core/interceptors/interceptors-consumer.js:15:53\n    at Observable._subscribe (/Users/manogel/projects/nest-log-trail/node_modules/rxjs/src/internal/observable/defer.ts:55:15)\n    at Observable._trySubscribe (/Users/manogel/projects/nest-log-trail/node_modules/rxjs/src/internal/Observable.ts:244:19)\n    at /Users/manogel/projects/nest-log-trail/node_modules/rxjs/src/internal/Observable.ts:234:18\n    at Object.errorContext (/Users/manogel/projects/nest-log-trail/node_modules/rxjs/src/internal/util/errorContext.ts:29:5)\n    at Observable.subscribe (/Users/manogel/projects/nest-log-trail/node_modules/rxjs/src/internal/Observable.ts:220:5)",
      "response": {
        "statusCode": 400,
        "message": "Bad request",
        "error": "Bad Request"
      },
      "status": 400,
      "options": {},
      "message": "Bad request",
      "name": "BadRequestException"
    }
  },
  "msg": "400 | [GET] /bad-request - 9ms",
  "date": "2023-01-14T21:06:49.316Z",
  "level": "ERROR",
  "context": "AppLoggerInterceptor"
}
```
</details>

# Common questions

> Why not pay for a monitoring system instead of this package?

I've always had problems with third-party tools for tracking issues. Either because I didn't have all the necessary information or difficulty using it. So I made my own logger implementation for total control of informations.

> What is the `modifyErrorPrototype` parameter used for?

Is an parameter enable by default to allow convert Error class in stringified object.
```
if (!('toJSON' in Error.prototype))
  Object.defineProperty(Error.prototype, 'toJSON', {
    value: function () {
      const alt = {};

      Object.getOwnPropertyNames(this).forEach(function (key) {
        alt[key] = this[key];
      }, this);

      return alt;
    },
    configurable: true,
    writable: true,
  });
```
For more details: [see stackoverflow](https://stackoverflow.com/questions/18391212/is-it-not-possible-to-stringify-an-error-using-json-stringify)


# I need your help
I need your help for collaborate and maintain this project 😊. Every help is welcome.