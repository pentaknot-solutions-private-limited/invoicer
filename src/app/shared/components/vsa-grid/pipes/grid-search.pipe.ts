import { Pipe, PipeTransform } from '@angular/core';
import { IGridColDef } from '../vsa-grid.model';
/*
 * Format Value based on callback logic
*/
@Pipe({name: 'searchPipe'})
export class GridSearchPipe implements PipeTransform {
  transform(rows: any, filterVal: any, allCols: IGridColDef[]): any {
    if(filterVal && allCols) {
      const filteredRows = rows.filter(row => {
        let filteredContentFound = false;
        allCols.forEach(col => {
          let value: any;
          if(col.valueFormatter && col.searchByFormatter) {
            value = col.valueFormatter(row[col.field],row, col);
          } else {
            value = row[col.field]
          }          
          // Compare Logic First convert to string then lowercase it.
          const found = String(value).toLowerCase().includes(String(filterVal).toLowerCase())
          if(found) {
            filteredContentFound = found
          }
        });
        return filteredContentFound;
      });
      return filteredRows
    } else {
      return rows;
    }
  }
}