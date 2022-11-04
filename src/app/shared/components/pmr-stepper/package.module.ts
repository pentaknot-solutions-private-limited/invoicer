import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PMRStepperComponent } from './pmr-stepper.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared-modules/material.module';

@NgModule({
  exports: [PMRStepperComponent],
  declarations: [PMRStepperComponent],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class PMRStepperModule { }
