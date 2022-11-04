import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../../shared-modules/material.module';
import { CommonModule } from '@angular/common';
import { VSATooltipModule } from '../vsa-tooltip';
import { VSAGridComponent } from './vsa-grid.component';
import {TableModule} from 'primeng/table';
import { GridHeightPipe } from './pipes/grid-hieght.pipe';
import { GridValueFormatterPipe } from './pipes/grid-value-formatter.pipe';
import { GridChipRendererComponent } from './renderers/grid-chip-renderer/grid-chip-renderer.component';
import { GridParamFormatterPipe } from './pipes/grid-param-formatter.pipe';
import { GridMultiRendererComponent } from './renderers/grid-multi-renderer/grid-multi-renderer.component';
import { VSAIconModule } from '../vsa-icon/package.module';
import { GridActionRendererComponent } from './renderers/grid-action-renderer/grid-action-renderer.component';
import { VSAButtonModule } from '../vsa-button/package.module';
import { GridSearchPipe } from './pipes/grid-search.pipe';
import { GridSearchInputComponent } from './components/grid-search-input/grid-search-input.component';
import { FormsModule } from '@angular/forms';
import { GridExpansionProjectComponent } from './components/grid-expansion-project/grid-expansion-project.component';
import { MultiSelectModule } from 'primeng/multiselect';


@NgModule({
  exports: [VSAGridComponent,GridSearchInputComponent],
  declarations: [
    VSAGridComponent, 
    GridHeightPipe, 
    GridValueFormatterPipe, 
    GridParamFormatterPipe,
    GridSearchPipe, 
    GridChipRendererComponent, 
    GridMultiRendererComponent,
    GridActionRendererComponent,
    GridSearchInputComponent,
    GridExpansionProjectComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    VSATooltipModule,
    TableModule,
    VSAIconModule,
    VSAButtonModule,
    MultiSelectModule
  ]
})
export class VSAGridModule { }
