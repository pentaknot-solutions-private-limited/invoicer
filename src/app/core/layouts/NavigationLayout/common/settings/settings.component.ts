import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  
  @Output() onBtnClick: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  // Drawer Action
  actionEvent(event) {
    let eventData = null;
    switch (event) {
      case "cancel":
        this.onBtnClick.emit(event);
        break;
    }
  }

}
