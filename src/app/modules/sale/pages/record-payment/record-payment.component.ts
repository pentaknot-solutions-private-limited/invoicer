import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { PaymentDetails } from "../../model/payment.model";
import { PaymentConfig } from "src/app/configs/plugin-components/payment.config";

@Component({
  selector: "record-payment",
  templateUrl: "./record-payment.component.html",
  styleUrls: ["./record-payment.component.scss"],
})
export class RecordPaymentComponent implements OnInit {
  @Input() selectedSale: any;
  @Output() onBtnClick: EventEmitter<any> = new EventEmitter();
  paymentConfig: PaymentConfig = new PaymentConfig();
  paymentDetails: PaymentDetails = new PaymentDetails();
  constructor() {
    this.paymentDetails.paymentModeId = 1; //Default: Cash
  }

  ngOnInit(): void {}

  selectionChanged(type: any, event?: any, i?: number) {
    switch (type) {
      case "customer":
        console.log(event);
      // this.selectedCustomer = event.selectedObj;
    }
  }
  actionEvent(event) {
    // let eventData = null;
    let data: any = {};
    switch (event) {
      default:
        this.onBtnClick.emit("close");
        break;
    }
  }
}
