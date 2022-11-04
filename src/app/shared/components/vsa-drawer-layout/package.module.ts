import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../../shared-modules/material.module';
import { VSADrawerLayoutComponent } from './vsa-drawer-layout.component';
import { VSAIconModule } from '../vsa-icon/package.module';
import { VSAButtonModule } from '../vsa-button/package.module';
import { CommonModule } from '@angular/common';
import { LeftDrawerTabExtraTemplate } from './vsa-drawer-tab.template';

@NgModule({
  exports: [VSADrawerLayoutComponent],
  declarations: [VSADrawerLayoutComponent, LeftDrawerTabExtraTemplate],
  imports: [
    CommonModule,
    MaterialModule,
    VSAIconModule,
    VSAButtonModule
  ]
})
export class VSADrawerLayoutModule { }
