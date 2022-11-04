import { AfterViewInit, Component, ContentChild, Input, OnInit } from '@angular/core';

@Component({
  selector: 'grid-chip-renderer',
  templateUrl: './grid-chip-renderer.component.html',
  styleUrls: ['./grid-chip-renderer.component.scss']
})
export class GridChipRendererComponent implements OnInit {
  @Input() value: any;
  @Input() params: IGridChipRendererParams;

  constructor() { }

  ngOnInit(): void {
  }

  getInvertColor(hex) {
    const rgb = hexToRgb(hex)
    // http://www.w3.org/TR/AERT#color-contrast
    const brightness = Math.round(((rgb[0] * 299) +
                        (rgb[1] * 587) +
                        (rgb[2] * 114)) / 1000);
    const textColour = (brightness > 135) ? 'black' : 'white';
    return textColour
  }

}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
   parseInt(result[1], 16),
   parseInt(result[2], 16),
   parseInt(result[3], 16)
  ] : [0,0,0]
}

export interface IGridChipRendererParams {
  chipColor?: 'pink' | 'purple' | 'green' | 'yellow' | 'orange' | 'blue';
  customColor?: string;
}