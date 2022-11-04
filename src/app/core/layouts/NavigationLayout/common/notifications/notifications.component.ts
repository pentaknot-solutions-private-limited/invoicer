import { Component, EventEmitter, OnInit, Output } from "@angular/core";

@Component({
  selector: "notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.scss"],
})
export class NotificationsComponent implements OnInit {
  
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
