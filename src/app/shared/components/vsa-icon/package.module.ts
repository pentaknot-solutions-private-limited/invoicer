import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../../shared-modules/material.module';
import { VSAIconComponent } from './vsa-icon.component';
import { CommonModule } from '@angular/common';
import { VSATooltipModule } from '../vsa-tooltip';


@NgModule({
  exports: [VSAIconComponent],
  declarations: [VSAIconComponent],
  imports: [
    CommonModule,
    MaterialModule,
    VSATooltipModule
  ]
})
export class VSAIconModule { }
