import { Pipe, PipeTransform } from '@angular/core';
/*
 * Calculate Grid Height
 * Takes a number to calculate.
*/
@Pipe({name: 'gridHeight'})
export class GridHeightPipe implements PipeTransform {
    headerHeight: number = 40;
    rowHeight: number = 50;
  transform(value: number, rowCounts: number): string {
      const maxHeight = (vh(100) - value)
    if(((rowCounts * this.rowHeight) + this.headerHeight) > maxHeight) {
        return `${maxHeight}px`
    } else {
        return null
    }
  }
}
function vh(v) {
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return (v * h) / 100;
}