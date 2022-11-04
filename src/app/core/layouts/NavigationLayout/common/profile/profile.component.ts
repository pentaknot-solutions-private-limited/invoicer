import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  @Input() loggedInUserData: any;
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
