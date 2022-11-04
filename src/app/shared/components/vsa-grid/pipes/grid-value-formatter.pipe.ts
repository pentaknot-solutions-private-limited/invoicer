import { Pipe, PipeTransform } from '@angular/core';
import { IGridColDef } from '../vsa-grid.model';
/*
 * Format Value based on callback logic
*/
@Pipe({name: 'valueFormatter'})
export class GridValueFormatterPipe implements PipeTransform {
  transform(value: any, row, col: IGridColDef): any {
    if(col.valueFormatter) {
        return col.valueFormatter(value, row, col)
    } else {
        return value
    }
  }
}