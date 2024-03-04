import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { CustomerConfig } from "src/app/configs/plugin-components/customer.config";
import { CustomerDetails } from "../../model/customer.model";
import { CustomerService } from "src/app/shared/_http/customer.service";
import { IResponseSchema } from "src/app/configs/api-config";
import { VSAToastyService } from "src/app/shared/components/vsa-toasty/vsa-toasty/vsa-toasty.service";

@Component({
  selector: "add-customer",
  templateUrl: "./add-customer.component.html",
  styleUrls: ["./add-customer.component.scss"],
})
export class AddCustomerComponent implements OnInit, OnChanges {
  // @Input() customerData: any;
  @Input() customerDetails: CustomerDetails;
  @Input() editMode: boolean;
  @Output() onBtnClick: EventEmitter<any> = new EventEmitter();
  customerConfig: CustomerConfig = new CustomerConfig();

  isBusiness: boolean;
  salutations: any[];
  loading: boolean;
  isEdit: boolean;
  constructor(
    private customerService: CustomerService,
    private toasty: VSAToastyService
  ) {
    this.getAddCustomerDependencies();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.customerDetails) {
      console.log(this.customerDetails);
      this.isEdit = this.customerDetails ? true : false;
    } else {
      this.customerDetails = new CustomerDetails();
    }
    
  }

  ngOnInit(): void {
    this.customerDetails.customerTypeId = "65e1af4ae5eae3eaa8c411d9"; // Set Default
    setTimeout(() => {
      this.customerTypeChanged("65e1af4ae5eae3eaa8c411d9"); // Setup as business
    }, 500);
  }

  customerTypeChanged(value: any) {
    switch (value) {
      case "65e1af56e5eae3eaa8c411dc":
        // Individual
        this.isBusiness = false;
        this.customerConfig.salutationSelect.options = this.salutations?.filter(
          (row: any) => !row["isBusiness"]
        );
        break;
      case "65e1af4ae5eae3eaa8c411d9":
        // Business
        this.isBusiness = true;
        this.customerConfig.salutationSelect.options = this.salutations?.filter(
          (row: any) => row["isBusiness"]
        );

        break;
      default:
        break;
    }
  }

  selectionChanged(type: any, event?: any, i?: number) {
    switch (type) {
      case "salutation":
        break;
    }
  }

  // Drawer Action Events
  actionEvent(event) {
    // let eventData = null;
    let data: any = {};
    switch (event) {
      case "save":
        // Save API
        this.addCustomer();
        break;
      default:
        this.onBtnClick.emit("close");
        break;
    }
  }

  // API

  addCustomer() {
    this.loading = true;
    this.customerService.addUpdateCustomer(this.customerDetails).subscribe(
      (res: IResponseSchema) => {
        if (!res?.error && res?.status == "success") {
          this.loading = false;
          this.toasty.success(res?.message);
          this.onBtnClick.emit("save");
        }
      },
      (err: any) => {
        this.loading = false;
        this.toasty.error(err.statusText || err?.message);
      }
    );
  }

  async getAddCustomerDependencies() {
    this.customerService.getAddCustomerDependencies().subscribe(
      (res: IResponseSchema) => {
        if (res?.error) {
          this.toasty.error(res?.message || res?.error);
        } else {
          if (res?.data) {
            this.customerConfig.customerTypeOption.options = res?.data[
              "customerTypes"
            ].map((row: any) => {
              return {
                ...row,
                value: row["_id"],
                label: row["name"],
              };
            });

            this.customerConfig.salutationSelect.options =
              res?.data["salutations"];
            this.salutations = res?.data["salutations"];
            this.customerConfig.stateSelect.options = res?.data["states"];
            this.customerConfig.placeOfSupplySelect.options =
              res?.data["states"];
          }
        }
      },
      (err: any) => {
        this.toasty.error(err.statusText);
      }
    );
  }
}
