import { ConfigurableModuleBuilder } from '@nestjs/common';
import { AppLoggerParams } from './types/AppLoggerParams.type';

const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<AppLoggerParams>({
    moduleName: 'AppLogger',
  }).build();

export const AppLoggerModuleClass = ConfigurableModuleClass;
export const AppLoggerModuleOptionsToken = MODULE_OPTIONS_TOKEN;
