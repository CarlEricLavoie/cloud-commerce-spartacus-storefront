import { ModuleWithProviders, NgModule } from '@angular/core';
import { Config } from '../config/config.module';
import { QualtricsConfig } from './config/qualtrics-config';

@NgModule({})
export class QualtricsLoaderModule {
  //TODO: instead forroot, put it in ngModule
  static forRoot(): ModuleWithProviders<QualtricsLoaderModule> {
    return {
      ngModule: QualtricsLoaderModule,
      providers: [
        {
          provide: QualtricsConfig,
          useExisting: Config,
        },
      ],
    };
  }
}