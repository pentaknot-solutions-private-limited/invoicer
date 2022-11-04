import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'grid-expansion-project',
  templateUrl: './grid-expansion-project.component.html',
  styleUrls: ['./grid-expansion-project.component.scss']
})
export class GridExpansionProjectComponent implements OnInit {

  @Input() data?: any;
  @Input() config?: any;
  @Output() onChildActionClicked: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    
  }

  onActionClicked(data: any, event: any) {
    const eventData = {
      event: event,
      data: data
    }
    this.onChildActionClicked.emit(eventData)
  }

}
