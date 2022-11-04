import { NgModule } from "@angular/core";
import { VSADrawerPanelComponent } from './vsa-drawer-panel.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/shared-modules/material.module';

@NgModule({
    imports: [CommonModule, MaterialModule],
    declarations: [VSADrawerPanelComponent],
    exports: [VSADrawerPanelComponent]
})

export class VSADrawerPanelModule {
    constructor() {
    }
}