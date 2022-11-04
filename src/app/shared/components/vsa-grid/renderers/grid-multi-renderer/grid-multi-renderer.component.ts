import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'grid-multi-renderer',
  templateUrl: './grid-multi-renderer.component.html',
  styleUrls: ['./grid-multi-renderer.component.scss']
})
export class GridMultiRendererComponent implements OnInit {

  @Input() params: IGridMultiRendererParams;

  constructor() { }

  ngOnInit(): void {
    //  this.params.iconPosition = "after"
  }

}

export interface IGridMultiRendererParams {
  color: string;
  fontWeight: number | string;
  fontSize: string;
  class?: string;
  iconPosition?: string;
  onlyIcon?: boolean;
  matIcon?: string;
  icons?: {
    iconName: string;
    iconTooltip?: string;
    iconSize?: string;
    iconColor?: string;
    
  }[]
}
