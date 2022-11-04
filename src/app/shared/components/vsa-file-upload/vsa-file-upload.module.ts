import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared-modules/material.module';
import { VSAIconModule } from '../vsa-icon/package.module';
import { VSAFileUploaderComponent } from './vsa-file-uploader.component';
import { DndDirective } from './dnd.directive';



@NgModule({
  declarations: [VSAFileUploaderComponent, DndDirective],
  exports: [VSAFileUploaderComponent, DndDirective],
  imports: [
    CommonModule,
    MaterialModule,
    VSAIconModule
  ]
})
export class VSAFileUploadModule { }
