import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { IDateTimeConfig } from './vsa-datetime-picker.model';
@Component({
  selector: 'vsa-datetime-picker',
  templateUrl: './vsa-datetime-picker.component.html',
  styleUrls: ['./vsa-datetime-picker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VSADateTimePickerComponent implements OnInit {
  @Input() config: IDateTimeConfig;
  @Output() onChange: EventEmitter<IDateTimeConfig> = new EventEmitter();
  constructor() {
    this.config = {
      disabled: false,
      // pickerType: 'calendar',
      // selectMode: 'range',
      // hour12Timer: true
    }
  }
  
  ngOnInit() {

  }
}
