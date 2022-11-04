import { formatDate } from "@angular/common";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { InvoicesConfigs } from "src/app/configs/plugin-components/invoices.config";
import { DrawerPanelService } from "src/app/shared/components/vsa-drawer-panel/src/vsa-drawer.service";
import { VSAGridComponent } from "src/app/shared/components/vsa-grid/vsa-grid.component";
import { PeriodModel } from "src/app/shared/model/period.model";
import { PolicesModel } from "src/app/shared/model/policies.model";
import { evalMomentExp } from "src/app/shared/utils/moment-exp.util";
import { DashboardService } from "src/app/shared/_http/dashboard.service";
import { InvoiceService } from "src/app/shared/_http/invoice.service";
import { SearchInvoiceModel } from "./invoices.model";

@Component({
  selector: "invoices",
  templateUrl: "./invoices.component.html",
  styleUrls: ["./invoices.component.scss"],
})
export class InvoicesComponent implements OnInit {
  // View Child
  @ViewChild("drawerTemplate") drawerTemplate: TemplateRef<any>;
  @ViewChild("grid") grid: VSAGridComponent;

  // Variables
  displayPeriodText = "Yesterday";
  periodModel: PeriodModel = new PeriodModel();
  periodData = [];
  currentDate = new Date();
  from: any;
  to: any;
  statistics: any = [];
  baseConfig = new InvoicesConfigs();
  // INVOICE FILTERS
  selectedFilterType: string = "all";
  searchForm: FormGroup = new FormGroup({
    invoiceNo: new FormControl(""),
    billToCustomer: new FormControl(""),
    ewayNo: new FormControl(""),
    poNo: new FormControl(""),
  });
  searchFormConfig = {
    invoiceNoInput: this.baseConfig.invoiceNoInput,
    billToCustomerInput: this.baseConfig.billToCustomerInput,
    ewayNoInput: this.baseConfig.ewayNoInput,
    poNoInput: this.baseConfig.poNoInput,
  };
  invoicesGridConfig = this.baseConfig.invoicesGrid;
  gridTitle: string = "";
  rowData: any[] = [];
  showGrid: boolean = true;
  pageComponentVisibility = {
    showInvoiceGeneration: false,
  };

  policesModel: PolicesModel = new PolicesModel();
  searchInvoiceModel: SearchInvoiceModel = new SearchInvoiceModel();
  entity: string = "";
  usecase: string = "";
  region: string = "";
  selectedStepData: any;

  constructor(
    private invoiceService: InvoiceService,
    private dashboardService: DashboardService,
    private drawerControllerService: DrawerPanelService
  ) {}

  ngOnInit(): void {
    this.getAllPeriodFilterData();
    this.getAllStatisticsData();
    this.getInvoices();

    // this.getAllEntity();
    // this.getAllUsecase();
    // this.getAllRegion();
  }

  onFilterApply() {
    console.log(this.searchForm.value);
    this.getInvoices();
  }

  onLinkClick(event) {
    console.log(event);
    this.selectedStepData = event;
    // this.openDrawer("invoice-generation", event);
    this.openDrawer("view-invoice", event);
  }

  // Filter Function
  onPeriodSelect(event: any) {
    console.log(event);
    this.displayPeriodText = event.name;
    this.periodModel.to = evalMomentExp(event.endDate).format("YYYY-MM-DD");
    this.periodModel.from = evalMomentExp(event.startDate).format("YYYY-MM-DD");
    console.log(this.periodModel);

    this.applyAPICall(event);
  }

  onApplyClick() {
    this.displayPeriodText = `${formatDate(
      this.from,
      "MM-dd-yyyy",
      "en-US"
    )} ~ ${formatDate(this.to, "MM-dd-yyyy", "en-US")}`;
    this.periodModel.from = this.from;
    this.periodModel.to = this.to;
  }

  onClearClick() {
    // this.from = "";
    // this.to = "";
    // this.onPeriodSelect("past_1_day");
  }

  onAddNewInvoiceClick() {
    this.openDrawer("invoice-generation");
  }

  applyAPICall(event) {
    console.log(event);
    this.getAllStatisticsData(event);
    this.getInvoices();
  }

  openDrawer(drawerCase: string, data?: any) {
    this.drawerControllerService.useCustomTemplate(false);
    switch (drawerCase) {
      case "invoice-generation":
        this.pageComponentVisibility.showInvoiceGeneration = true;
        this.drawerControllerService.createContainer(this.drawerTemplate);
        this.drawerControllerService.toggleDrawer(true);
        this.drawerControllerService.showCloseButton(false);
        this.drawerControllerService.setEscClose(false);
        this.drawerControllerService.setTitle(`Create New Invoice`);
        this.drawerControllerService.changeDrawerSize("extra-large");
        break;
      default:
        break;
    }
  }

  clearDrawerData() {
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

  drawerAction(event) {
    switch (event.action) {
      case "done":
        this.clearDrawerData();
        break;

      default:
        this.clearDrawerData();
        break;
    }
    this.clearDrawerData();
  }

  // API Calls
  getInvoices() {
    const searchFilter = {
      filter: this.selectedFilterType,
      ...this.searchForm.value,
    };
    this.invoiceService.getInvoices(searchFilter).subscribe((res: any) => {
      if (res) {
        this.rowData = res;
      }
    });
  }

  // Dashboard API
  getAllStatisticsData(event?: any) {
    this.dashboardService.getAllStatisticsData(event).subscribe((res: any) => {
      if (res) {
        this.statistics = res;
      }
    });
  }

  getAllPeriodFilterData() {
    this.dashboardService.getAllPeriodFilterData().subscribe((res: any) => {
      if (res) {
        this.periodData = res;
      }
    });
  }
}
