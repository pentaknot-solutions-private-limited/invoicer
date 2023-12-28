import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormsModule,
  NG_VALIDATORS,
  ReactiveFormsModule,
} from "@angular/forms";
import { VSAInputComponent } from "./vsa-input.component";
import { MaterialModule } from "../../shared-modules/material.module";
// import { RMIconModule } from '../vsa-icon/package.module';
import { VSADateTimePickerModule } from "../vsa-datetime-picker/package.module";
import { VSADateTimeModule } from "../vsa-datetime-picker/date-time/date-time.module";
import { OwlNativeDateTimeModule } from "../vsa-datetime-picker/date-time/adapter/native-date-time.module";
import { OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS } from "../vsa-datetime-picker/date-time/adapter/moment-adapter/moment-date-time-adapter.class";
import { VSAIconModule } from "../vsa-icon/package.module";
import { IndianCurrencyPipe } from "../../pipes/indian-currency-pipe";

@NgModule({
  imports: [
    CommonModule,
    OwlNativeDateTimeModule,

    VSADateTimePickerModule,
    VSADateTimeModule,
    MaterialModule,
    VSAIconModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [VSAInputComponent, IndianCurrencyPipe],
  exports: [VSAInputComponent],
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: VSAInputComponent,
      multi: true,
    },
  ],
})
export class VSAInputModule {}
