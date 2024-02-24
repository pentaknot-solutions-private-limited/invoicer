import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CustomerConfig } from "src/app/configs/plugin-components/customer.config";
import { CustomerDetails } from "../../model/customer.model";

@Component({
  selector: "add-customer",
  templateUrl: "./add-customer.component.html",
  styleUrls: ["./add-customer.component.scss"],
})
export class AddCustomerComponent implements OnInit {
  @Input() customerData: any;
  @Output() onBtnClick: EventEmitter<any> = new EventEmitter();
  customerConfig: CustomerConfig = new CustomerConfig();
  customerDetails: CustomerDetails = new CustomerDetails();
  isBusiness: boolean;
  constructor() {
    this.customerDetails.customerTypeId = 1; // Default  Add
  }

  ngOnInit(): void {}

  customerTypeChanged(value: any) {
    switch (value) {
      case 1:
        // Individual
        this.isBusiness = false;
        break;
      case 2:
        // Business
        this.isBusiness = true;
        break;
      default:
        break;
    }
  }

  selectionChanged(type: any, event?: any, i?: number) {
    switch (type) {
      case "salutation":
        // this.getAllBranchByOrgId();
        // this.companyDetailsModel.companyCode = event?.selectedObj?.companyCode;
        // this.invoiceFinalData.companyDetails.organization.name =
        //   event?.selectedObj?.name;
        // this.invoiceFinalData.companyDetails.organization.emailId =
        //   event?.selectedObj?.emailId;

        break;
    }
  }

  // Drawer Action Events
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
