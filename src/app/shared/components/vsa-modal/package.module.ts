import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../../shared-modules/material.module';
import { VSAIconModule } from '../vsa-icon/package.module';
import { VSAModalComponent } from './vsa-modal.component';
import { CommonModule } from '@angular/common';
import { VSAButtonModule } from '../vsa-button/package.module';
import { VSAModalDialogComponent } from './vsa-modal.dialog';


@NgModule({
  exports: [VSAModalComponent],
  declarations: [VSAModalComponent, VSAModalDialogComponent],
  entryComponents: [VSAModalDialogComponent],
  imports: [
    CommonModule,
    MaterialModule,
    VSAIconModule,
    VSAButtonModule
  ]
})
export class VSAModalModule { }
