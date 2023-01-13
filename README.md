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

```
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

```javascript
import { AppLoggerModule } from '@manogel/nestjs-log-trail';

@Module({
  imports: [
    AppLoggerModule.register({})
  ],
})
```

## Default configuration with registerAsync

`Update app.module.ts with:`

```javascript
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

```
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