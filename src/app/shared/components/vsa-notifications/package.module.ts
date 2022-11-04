import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../../shared-modules/material.module';
import { VSAIconModule } from '../vsa-icon/package.module';
import { CommonModule } from '@angular/common';
import { VSAButtonModule } from '../vsa-button/package.module';
import { VSANotificationComponent } from './vsa-notifications.component';
// import { VSARadioModule } from '../vsa-radio/package.module';


@NgModule({
  exports: [VSANotificationComponent],
  declarations: [VSANotificationComponent],
  entryComponents: [VSANotificationComponent],
  imports: [
    CommonModule,
    MaterialModule,
    VSAIconModule,
    VSAButtonModule,
    // VSARadioModule
  ]
})
export class VSANotificationModule { }
