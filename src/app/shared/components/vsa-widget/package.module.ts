import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VSAWidgetComponent } from './vsa-widget.component';
import { VSAIconModule } from '../vsa-icon/package.module';
import { VSALoaderModule } from '../vsa-loader/package.module';
import { VSAChartModule } from '../vsa-chart/package.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { VSAGridModule } from '../vsa-grid/package.module';
import { MaterialModule } from '../../shared-modules/material.module';

@NgModule({
  declarations: [VSAWidgetComponent],
  exports: [VSAWidgetComponent],
  imports: [
    CommonModule,
    VSAIconModule,
    VSALoaderModule,
    VSAChartModule,
    VSAGridModule,
    OverlayModule,
    PortalModule,
    MaterialModule
  ],
})
export class VSAWidgetModule {}
