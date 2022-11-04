import { AfterViewInit, Component, ContentChild, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'grid-action-renderer',
  templateUrl: './grid-action-renderer.component.html',
  styleUrls: ['./grid-action-renderer.component.scss']
})
export class GridActionRendererComponent implements OnInit {
  @Input() params?: any;
  @Input() hideAction?: any;
  @Output() onActionClick: EventEmitter<any> = new EventEmitter();;

  constructor() { }

  ngOnInit(): void {
    // console.log(this.params);
  }

  onBtnClick(event: any,data: any) {
    const eventData = {
      event: event,
      data: data
    }
    this.onActionClick.emit(eventData)
  }

  onDeleteUserClick() {
    // console.log();
  }

}

export interface IGridActionRendererParams {
  type?: any;
  icon?: any;
  text?: any;
  color?: any;
  row?: any;
  action?: any;
  class?: any;
  disabled?: boolean;
}