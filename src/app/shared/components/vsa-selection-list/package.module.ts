
import { NgModule } from '@angular/core';
import { MaterialModule } from '../../shared-modules/material.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VSASelectionListComponent } from './vsa-selection-list.component';
import { VSAInputModule } from '../vsa-input/package.module';
import { VSAToggleModule } from '../vsa-toggle/package.module';

@NgModule({
    exports: [VSASelectionListComponent],
    declarations: [VSASelectionListComponent],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        VSAInputModule,
        VSAToggleModule
    ]
})
export class VSASelectionListModule { }
