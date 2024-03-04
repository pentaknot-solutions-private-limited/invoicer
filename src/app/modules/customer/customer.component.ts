import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { IResponseSchema } from "src/app/configs/api-config";
import { CustomerConfig } from "src/app/configs/plugin-components/customer.config";
import { CustomerService } from "src/app/shared/_http/customer.service";
import { DrawerPanelService } from "src/app/shared/components/vsa-drawer-panel/src/vsa-drawer.service";
import { VSANotificationComponent } from "src/app/shared/components/vsa-notifications/vsa-notifications.component";
import { VSAToastyService } from "src/app/shared/components/vsa-toasty/vsa-toasty/vsa-toasty.service";

@Component({
  selector: "app-customer",
  templateUrl: "./customer.component.html",
  styleUrls: ["./customer.component.scss"],
})
export class CustomerComponent implements OnInit {
  // View Child
  @ViewChild("drawerTemplate") drawerTemplate: TemplateRef<any>;

  // Variables

  showGrid: boolean = true;

  pageComponentVisibility = {
    showAddCustomer: false,
  };

  loading!: boolean;
  customerData: any;
  customerConfig: CustomerConfig = new CustomerConfig();
  rowData: any[];
  constructor(
    private drawerControllerService: DrawerPanelService,
    private customerService: CustomerService,
    private toasty: VSAToastyService
  ) {}

  ngOnInit(): void {
    this.getAllCustomers();
  }

  onLinkClick(event) {
    // console.log(event);
  }

  onInputChanged(event?: any) {}

  actionClicked(event) {
    // this.customerData = {};
    console.log(event);

    switch (event?.event) {
      case "edit":
        this.customerData = event?.data;
        this.openDrawer("edit-customer");
        break;
      case "delete":
        this.customerData = event?.data;
        this.deleteCustomer();
        break;

      default:
        break;
    }
  }

  // Drawer

  openDrawer(drawerCase: string, data?: any) {
    this.drawerControllerService.useCustomTemplate(false);
    switch (drawerCase) {
      case "add-customer":
        this.pageComponentVisibility.showAddCustomer = true;
        this.drawerControllerService.createContainer(this.drawerTemplate);
        this.drawerControllerService.toggleDrawer(true);
        this.drawerControllerService.showCloseButton(false);
        this.drawerControllerService.setEscClose(false);
        this.drawerControllerService.setTitle(`New Customer`);
        this.drawerControllerService.changeDrawerSize("medium");
        break;
      case "edit-customer":
        this.pageComponentVisibility.showAddCustomer = true;
        this.drawerControllerService.createContainer(this.drawerTemplate);
        this.drawerControllerService.toggleDrawer(true);
        this.drawerControllerService.showCloseButton(false);
        this.drawerControllerService.setEscClose(false);
        this.drawerControllerService.setTitle(`Edit Customer`);
        this.drawerControllerService.changeDrawerSize("medium");
        break;
      default:
        break;
    }
  }

  clearDrawerData() {
    this.customerData = {};
    this.pageComponentVisibility.showAddCustomer = false;
    this.drawerControllerService.toggleDrawer(false);
    this.drawerControllerService.setEscClose(false);
    this.drawerControllerService.setTitle(null);
    this.closeAllDrawerComponent();
  }

  closeAllDrawerComponent() {
    // Loop through all component and hide
    for (const item in this.pageComponentVisibility) {
      this.pageComponentVisibility[item] = false;
    }
  }

  drawerAction(event: any) {
    switch (event) {
      case "save":
        // Refresh
        this.getAllCustomers();
        break;
      default:
        this.clearDrawerData();
        break;
    }
    this.clearDrawerData();
  }

  deleteCustomer() {
    if (confirm("Are you sure, you want to delete?")) {
      this.customerService.deleteCustomer(this.customerData?._id).subscribe(
        (res: IResponseSchema) => {
          if (res?.data) {
            console.log(res);
            // Refresh
            this.getAllCustomers();
            this.customerData = {};
          }
          this.toasty.success(res?.message);
        },
        (err: any) => {
          console.log(err);
          this.toasty.success(err?.message || err?.errorText);
        }
      );
    }
  }

  // Methods
  addCustomer() {
    this.openDrawer("add-customer");
  }

  // API
  getAllCustomers() {
    this.customerService.getAllCustomers().subscribe((res: any) => {
      if (res.data) {
        this.rowData = res.data;
      }
    });
  }
}
