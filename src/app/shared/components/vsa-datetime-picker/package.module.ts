import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../../shared-modules/material.module';
import { OwlNativeDateTimeModule } from './date-time/adapter/native-date-time.module';
import { VSADateTimeModule } from './date-time/date-time.module';
import { VSADateTimePickerComponent } from './vsa-datetime-picker.component';
@NgModule({
    exports: [VSADateTimePickerComponent],
    declarations: [VSADateTimePickerComponent],
    imports: [
        MaterialModule,
        OwlNativeDateTimeModule,
        VSADateTimeModule,
    ]
})
export class VSADateTimePickerModule { }
