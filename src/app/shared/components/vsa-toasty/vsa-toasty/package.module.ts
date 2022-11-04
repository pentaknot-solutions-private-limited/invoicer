import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { Toast } from './vsa-toasty.component';
import {
  DefaultNoComponentGlobalConfig,
  GlobalConfig,
  TOAST_CONFIG,
} from './vsa-toasty-config';
import { VSAIconModule } from '../../vsa-icon/package.module';

export const DefaultGlobalConfig: GlobalConfig = {
  ...DefaultNoComponentGlobalConfig,
  toastComponent: Toast,
};

@NgModule({
  imports: [CommonModule, VSAIconModule],
  declarations: [Toast],
  exports: [Toast],
  entryComponents: [Toast],
})
export class VSAToastyModule {
  static forRoot(config: Partial<GlobalConfig> = {}): ModuleWithProviders<VSAToastyModule> {
    return {
      ngModule: VSAToastyModule,
      providers: [
        {
          provide: TOAST_CONFIG,
          useValue: {
            default: DefaultGlobalConfig,
            config,
          },
        },
      ],
    };
  }
}

@NgModule({
  imports: [CommonModule],
})
export class ToastyComponentlessModule {
  static forRoot(config: Partial<GlobalConfig> = {}): ModuleWithProviders<VSAToastyModule> {
    return {
      ngModule: VSAToastyModule,
      providers: [
        {
          provide: TOAST_CONFIG,
          useValue: {
            default: DefaultNoComponentGlobalConfig,
            config,
          },
        },
      ],
    };
  }
}
