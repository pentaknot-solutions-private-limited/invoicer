import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { IResponseSchema } from "src/app/configs/api-config";
import { CustomerConfig } from "src/app/configs/plugin-components/customer.config";
import { SaleConfig } from "src/app/configs/plugin-components/sale.config";
import { CustomerService } from "src/app/shared/_http/customer.service";
import { InventoryService } from "src/app/shared/_http/inventory.service";
import { SaleService } from "src/app/shared/_http/sale.service";
import { DrawerPanelService } from "src/app/shared/components/vsa-drawer-panel/src/vsa-drawer.service";
import { SaleDetails } from "./model/sale.model";
import { InvoicePDF } from "src/app/shared/invoice-template/view-invoice-template";
import { Router } from "@angular/router";

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
  selectedSale: SaleDetails;
  customerConfig: CustomerConfig = new CustomerConfig();
  saleConfig: SaleConfig = new SaleConfig();
  rowData: any[];
  lastScreen: string;

  constructor(
    private drawerControllerService: DrawerPanelService,
    private saleService: SaleService,
    private inventoryService: InventoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllSales();
    // this.getAllCustomers();
  }

  onLinkClick(data: SaleDetails) {
    // console.log(data);
    this.selectedSale = data;
    this.getInventoryDetailsById(data?.saleItems[0]?.inventoryId);
  }

  onInputChanged(event?: any) {}

  actionClicked(event) {
    // console.log(event);
    switch (event.event) {
      case "record-payment":
        this.selectedSale = event.data;
        this.openDrawer(event.event);
        break;
      case "payment-schedule":
        this.selectedSale = event.data;
        this.openDrawer(event.event);
        break;
      case "download":
        this.selectedSale = event.data;
        this.getInventoryDetailsById(
          this.selectedSale.saleItems[0]?.inventoryId,
          true
        );
        break;
      case "edit":
        // console.log(event);
        this.selectedSale = event.data;
        this.openDrawer("edit-sale");
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
      case "edit-sale":
        this.pageComponentVisibility.showAddSale = true;
        this.drawerControllerService.createContainer(this.drawerTemplate);
        this.drawerControllerService.toggleDrawer(true);
        this.drawerControllerService.showCloseButton(false);
        this.drawerControllerService.setEscClose(false);
        this.drawerControllerService.changeDrawerSize("large");
        this.drawerControllerService.setTitle(
          drawerCase == "add-sale" ? `New Sale` : "Edit Sale"
        );
        break;
      case "record-payment":
        this.pageComponentVisibility.showRecordPayment = true;
        this.drawerControllerService.createContainer(this.drawerTemplate);
        this.drawerControllerService.toggleDrawer(true);
        this.drawerControllerService.showCloseButton(false);
        this.drawerControllerService.setEscClose(false);
        this.drawerControllerService.setTitle(
          `Record Payment for ${this.selectedSale?.invoiceNo}`
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
          `Payment Schedule for ${this.selectedSale?.invoiceNo}`
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
    this.selectedSale = undefined;
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
      case "save":
        this.clearDrawerData();
        // Refresh Listing
        this.getAllSales();
        break;
      case "record-payment":
        this.lastScreen = "payment-schedule";
        this.openDrawer(event);
        break;
      case "payment-schedule":
        this.lastScreen = "";
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
    this.clearDrawerData();
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
        console.log(res?.data);
        this.rowData = res.data?.map((row: any) => {
          return {
            ...row,
            customer: row["customerId"],
            status: row["saleStatusId"],
            customerId: row["customerId"]["_id"],
          };
        });
      }
    });
  }

  async getInventoryDetailsById(id: any, isDownload?: boolean) {
    this.inventoryService
      .getInventoryById(id)
      .subscribe((res: IResponseSchema) => {
        if (!res?.error) {
          // console.log("Success!", res?.data);

          this.selectedSale.saleItems[0] = {
            ...this.selectedSale.saleItems[0],
            carDetails: res?.data[0],
          };
          // open pdf
          let data: any = {
            customer: this.selectedSale?.customer,
            // place: place,
            saleDetails: this.selectedSale,
            listItems: this.selectedSale?.saleItems,
            exchangeListItems: this.selectedSale?.exchangeItems,
          };
          // console.log(data);
          setTimeout(() => {
            isDownload
              ? new InvoicePDF(data).downloadPdf(
                  `${this.selectedSale?.invoiceNo}`
                )
              : new InvoicePDF(data).openPdf();
          }, 0);
        }
      });
  }
}
