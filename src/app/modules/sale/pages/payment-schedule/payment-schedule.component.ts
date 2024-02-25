import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { PaymentDetails } from "../../model/payment.model";
import { PaymentConfig } from "src/app/configs/plugin-components/payment.config";
import { PaymentScheduleConfig } from "src/app/configs/plugin-components/payment-schedule.config";
import { VSAGridComponent } from "src/app/shared/components/vsa-grid/vsa-grid.component";

@Component({
  selector: "payment-schedule",
  templateUrl: "./payment-schedule.component.html",
  styleUrls: ["./payment-schedule.component.scss"],
})
export class PaymentScheduleComponent implements OnInit {
  @Input() selectedSale: any;
  @Output() onBtnClick: EventEmitter<any> = new EventEmitter();
  @ViewChild('grid') grid: VSAGridComponent;

  // Variables
  paymentScheduleConfig: PaymentScheduleConfig = new PaymentScheduleConfig();
  paymentConfig: PaymentConfig = new PaymentConfig();
  paymentDetails: PaymentDetails = new PaymentDetails();
  lastPaymentId: number;

  rowData: any[] = [];
  constructor() {
    this.rowData = [
      {
        paymentId: 1,
        invoiceId: 1,
        amount: 200000,
        modeOfPaymentId: 1,
        modeOfPayment: "Cash",
        paymentDate: "2024-02-02",
      },
      {
        paymentId: 2,
        invoiceId: 1,
        amount: 330000,
        modeOfPaymentId: 3,
        modeOfPayment: "IMPS",
        paymentDate: "2024-02-25",
      },
    ];
  }

  ngOnInit(): void {}

  onLinkClick(event) {
    // console.log(event);
  }

  onInputChanged(event?: any) {}

  actionClicked(event) {
    console.log(event);
    switch (event.event) {
      default:
        break;
    }

    // this.customerData = {};
  }

  selectionChanged(type: any, event?: any, i?: number) {}
  actionEvent(event) {
    // let eventData = null;
    let data: any = {};
    switch (event) {
      case "export-payment-schedule":
        this.grid.exportExcel('WWI_PAYMENT_SCHEDULE');
        break;
      case "record-payment":
        this.onBtnClick.emit(event);
        break;
      default:
        this.onBtnClick.emit("close");
        break;
    }
  }
}
