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
  lastPaymentId: number;
  lastScreen: string;
  constructor() {
    this.paymentDetails.paymentModeId = 1; //Default: Cash
    this.lastPaymentId = 1012;
  }

  ngOnInit(): void {
    this.paymentDetails.paymentNumber = Number(this.lastPaymentId) + 1;
    this.paymentDetails.customerId = 1;
  }

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
        this.onBtnClick.emit(this.lastScreen || "close");
        break;
    }
  }
}
