import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../../shared-modules/material.module';
import { VSAButtonComponent } from './vsa-button.component';
import { CommonModule } from '@angular/common';
import { VSAIconModule } from '../vsa-icon/package.module';


@NgModule({
  exports: [VSAButtonComponent],
  declarations: [VSAButtonComponent],
  imports: [
    CommonModule,
    MaterialModule,
    VSAIconModule
  ]
})
export class VSAButtonModule { }
