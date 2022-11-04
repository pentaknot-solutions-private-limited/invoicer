import { Pipe, PipeTransform } from '@angular/core';
import { IGridColDef } from '../vsa-grid.model';
/*
 * Format Value based on callback logic
*/
@Pipe({name: 'paramFormatter'})
export class GridParamFormatterPipe implements PipeTransform {
  transform(value: any, row, col: IGridColDef): any {
    if(col.rendererParams && typeof col.rendererParams == 'function') {
        return col.rendererParams(value, row, col)
    } else {
        return col.rendererParams
    }
  }
}