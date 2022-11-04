import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { VSASelectBoxComponent } from './vsa-select-box.component';
import { FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared-modules/material.module';
import { SelectSearchPipe } from "./pipe/select-search.pipe";
import {ScrollingModule} from '@angular/cdk/scrolling';
import { SelectCheckAllComponent } from './select-check-all.component';
import { VSAIconModule } from "../vsa-icon/package.module";

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    VSAIconModule,
    ScrollingModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' })
  ],
  declarations: [VSASelectBoxComponent, SelectSearchPipe, SelectCheckAllComponent],
  exports: [VSASelectBoxComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: VSASelectBoxComponent,
      multi: true
    }
  ]
})

export class VSASelectBoxModule { }