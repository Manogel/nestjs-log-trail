import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppLoggerModule } from './app-logger/appLogger.module';

@Module({
  imports: [
    AppLoggerModule.registerAsync({
      useFactory: () => {
        return {
          convertLogObjToString: false,
          setLoggerListener(data) {
            console.log('data', data);
          },
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
