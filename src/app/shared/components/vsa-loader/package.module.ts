import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../shared-modules/material.module';
import { VSALoaderComponent } from "./vsa-loader.component";

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [VSALoaderComponent],
  exports: [VSALoaderComponent],
})

export class VSALoaderModule { }