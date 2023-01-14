import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { AppLoggerModule } from './app-logger/appLogger.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { AppLoggerModule } from '@manogel/nestjs-log-trail';

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
