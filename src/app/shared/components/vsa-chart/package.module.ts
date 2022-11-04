import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VSAChartComponent } from './vsa-chart.component';
import { ChartsModule } from 'ng2-charts';
import { VSALoaderModule } from '../vsa-loader/package.module';



@NgModule({
  declarations: [
    VSAChartComponent
  ],
  exports: [
    VSAChartComponent
  ],
  imports: [
    CommonModule,
    VSALoaderModule,
    // Charts
    ChartsModule
  ]
})
export class VSAChartModule { }
