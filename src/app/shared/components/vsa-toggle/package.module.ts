
import { NgModule } from '@angular/core';
import { MaterialModule } from '../../shared-modules/material.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VSAToggleComponent } from './vsa-toggle.component';

@NgModule({
    exports: [VSAToggleComponent],
    declarations: [VSAToggleComponent],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule
    ]
})
export class VSAToggleModule { }
