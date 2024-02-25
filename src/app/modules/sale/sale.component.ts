import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { CustomerConfig } from "src/app/configs/plugin-components/customer.config";
import { SaleConfig } from "src/app/configs/plugin-components/sale.config";
import { CustomerService } from "src/app/shared/_http/customer.service";
import { SaleService } from "src/app/shared/_http/sale.service";
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
    showRecordPayment: false,
    showPaymentSchedule: false,
  };

  loading!: boolean;
  customerData: any;
  selectedSale: any;
  customerConfig: CustomerConfig = new CustomerConfig();
  saleConfig: SaleConfig = new SaleConfig();
  rowData: any[];
  lastScreen: string;

  constructor(
    private drawerControllerService: DrawerPanelService,
    private customerService: CustomerService,
    private saleService: SaleService
  ) {}

  ngOnInit(): void {
    this.getAllSales();
    // this.getAllCustomers();
  }

  onLinkClick(event) {
    // console.log(event);
  }

  onInputChanged(event?: any) {}

  actionClicked(event) {
    console.log(event);
    switch (event.event) {
      case "record-payment":
        this.selectedSale = event.data;
        this.openDrawer(event.event);
        break;
      case "payment-schedule":
        this.selectedSale = event.data;
        this.openDrawer(event.event);
        break;

      default:
        break;
    }

    // this.customerData = {};
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
      case "record-payment":
        this.pageComponentVisibility.showRecordPayment = true;
        this.drawerControllerService.createContainer(this.drawerTemplate);
        this.drawerControllerService.toggleDrawer(true);
        this.drawerControllerService.showCloseButton(false);
        this.drawerControllerService.setEscClose(false);
        this.drawerControllerService.setTitle(
          `Record Payment for ${this.selectedSale?.invoiceNumber}`
        );
        this.drawerControllerService.changeDrawerSize("extra-small");
        break;
      case "payment-schedule":
        this.pageComponentVisibility.showPaymentSchedule = true;
        this.drawerControllerService.createContainer(this.drawerTemplate);
        this.drawerControllerService.toggleDrawer(true);
        this.drawerControllerService.showCloseButton(false);
        this.drawerControllerService.setEscClose(false);
        this.drawerControllerService.setTitle(
          `Payment Schedule for ${this.selectedSale?.invoiceNumber}`
        );
        this.drawerControllerService.changeDrawerSize("small");
        break;
      default:
        break;
    }
  }

  clearDrawerData() {
    this.lastScreen = "";
    this.customerData = {};
    this.selectedSale = {};
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
      case "export-payment-schedule":
        break;
      case "record-payment":
        this.lastScreen = "payment-schedule";
        this.openDrawer(event);
        break;
      case "payment-schedule":
        this.lastScreen = '';
        this.openDrawer(event);
        break;
      default:
        this.clearDrawerData();
        break;
    }
    // this.clearDrawerData();
  }

  // Methods
  addSale() {
    this.openDrawer("add-sale");
  }

  // API
  // getAllCustomers() {
  //   this.customerService.getAllCustomers().subscribe((res: any) => {
  //     if (res.data) {
  //       this.rowData = res.data;
  //     }
  //   });
  // }
  getAllSales() {
    this.saleService.getAllSales().subscribe((res: any) => {
      if (res.data) {
        this.rowData = res.data;
      }
    });
  }
}
