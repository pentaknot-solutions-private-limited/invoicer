import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { CustomerConfig } from "src/app/configs/plugin-components/customer.config";
import { CustomerService } from "src/app/shared/_http/customer.service";
import { DrawerPanelService } from "src/app/shared/components/vsa-drawer-panel/src/vsa-drawer.service";

@Component({
  selector: "sale",
  templateUrl: "./sale.component.html",
  styleUrls: ["./sale.component.scss"],
})
export class SaleComponent implements OnInit {
  // View Child
  @ViewChild("drawerTemplate") drawerTemplate: TemplateRef<any>;

  // Variables

  showGrid: boolean = true;

  pageComponentVisibility = {
    showAddSale: false,
  };

  loading!: boolean;
  customerData: any;
  customerConfig: CustomerConfig = new CustomerConfig();
  rowData: any[];
  constructor(
    private drawerControllerService: DrawerPanelService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.getAllCustomers();
  }

  onLinkClick(event) {
    // console.log(event);
  }

  onInputChanged(event?: any) {}

  actionClicked(event) {
    this.customerData = {};
  }

  // Drawer

  openDrawer(drawerCase: string, data?: any) {
    this.drawerControllerService.useCustomTemplate(false);
    switch (drawerCase) {
      case "add-sale":
        this.pageComponentVisibility.showAddSale = true;
        this.drawerControllerService.createContainer(this.drawerTemplate);
        this.drawerControllerService.toggleDrawer(true);
        this.drawerControllerService.showCloseButton(false);
        this.drawerControllerService.setEscClose(false);
        this.drawerControllerService.setTitle(`New Sale`);
        this.drawerControllerService.changeDrawerSize("medium");
        break;
      default:
        break;
    }
  }

  clearDrawerData() {
    this.customerData = {};
    this.pageComponentVisibility.showAddSale = false;
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
      default:
        this.clearDrawerData();
        break;
    }
    this.clearDrawerData();
  }

  // Methods
  addSale() {
    this.openDrawer("add-sale");
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
