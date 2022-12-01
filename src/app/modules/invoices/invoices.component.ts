import { formatDate } from "@angular/common";
import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
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
import jsPDF from "jspdf";

@Component({
  selector: "invoices",
  templateUrl: "./invoices.component.html",
  styleUrls: ["./invoices.component.scss"],
})
export class InvoicesComponent implements OnInit {
  // View Child
  @ViewChild("drawerTemplate") drawerTemplate: TemplateRef<any>;
  @ViewChild("grid") grid: VSAGridComponent;
  @ViewChild("pdfTable") pdfTable: ElementRef;

  // Variables
  displayPeriodText = "Today";
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
    // ewayNo: new FormControl(""),
    // poNo: new FormControl(""),
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
  invoiceData: any;
  invoiceDrawerType: string = '';

  constructor(
    private invoiceService: InvoiceService,
    private dashboardService: DashboardService,
    private drawerControllerService: DrawerPanelService
  ) {}

  ngOnInit(): void {
    this.getAllPeriodFilterData();
    this.getInvoices();
    // Simulation
    setTimeout(() => {
      // this.getAllStatisticsData();
    }, 500);

    // this.getAllEntity();
    // this.getAllUsecase();
    // this.getAllRegion();
  }

  onFilterApply() {
    // console.log(this.searchForm.value);
    this.getInvoices();
  }

  onLinkClick(event) {
    console.log(event);
    this.selectedStepData = event;
    // this.openDrawer("invoice-generation", event);
    this.invoiceDrawerType = 'view'
    this.invoiceData = event
    this.openDrawer("invoice-generation", event);
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
    this.invoiceDrawerType = 'add'
    this.openDrawer("invoice-generation");
  }

  applyAPICall(event) {
    console.log(event);
    // this.getAllStatisticsData(event);
    this.getInvoices();
  }

  actionClicked(event) {
    this.invoiceData = {};
    if (event.event == "edit") {
      this.invoiceData = event.data;
      this.invoiceDrawerType = 'edit'
      this.openDrawer("invoice-generation",this.invoiceData);
    } else {
      this.invoiceData = event.data;
      if (this.invoiceData) {
        setTimeout(() => {
          var pdfTable = document.getElementById("pdfTable");
          pdfTable.style.display = "block";
          const isExist = document.getElementsByTagName("div")[0];
          if (isExist) {
            const doc = new jsPDF("p", "pt", "a4");
            doc.setFont("Helvetica");
            //pdf.html(doc).then(() => pdf.save('fileName.pdf'));

            doc.html(this.pdfTable.nativeElement, {
              callback: (doc) => {
                doc.deletePage(13);
                doc.deletePage(12);
                doc.deletePage(11);
                doc.deletePage(10);
                doc.deletePage(9);
                doc.deletePage(8);
                doc.deletePage(7);
                doc.deletePage(6);
                doc.deletePage(5);
                doc.deletePage(4);
                doc.deletePage(3);
                doc.deletePage(2);

                const filename =
                  this.invoiceData.invoiceNo +
                  "_invoice.pdf";
                doc.save(filename);
                pdfTable.style.display = "none";
              },
            });
          }
        }, 500);
      }
    }
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
        this.drawerControllerService.setTitle(data ? `Edit/View Invoice` : `Create New Invoice`);
        this.drawerControllerService.changeDrawerSize("extra-large");
        break;
      default:
        break;
    }
  }

  clearDrawerData() {
    this.invoiceData = {}
    this.pageComponentVisibility.showInvoiceGeneration = false;
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
    switch (event) {
      case "done":
        this.clearDrawerData();
        this.getInvoices('all',true);
        break;

      default:
        this.clearDrawerData();
        break;
    }
    this.clearDrawerData();
  }

  // API Calls
  getInvoices(event?: string, isFilterChanged?: boolean) {
    const searchFilter = {
      filter: this.selectedFilterType,
      ...this.searchForm.value,
    };
    this.invoiceService.getInvoices(searchFilter).subscribe((res: any) => {
      if (res.data) {
        this.rowData = res.data.sort((a, b) => b.createdAt > a.createdAt ? 1 : -1);
        // TEMP
        // this.invoiceData = res.data[0];
        if (!isFilterChanged) {
          const all = {
            label: "All",
            type: "all",
            value: res.data.length ? res.data.length : 0,
          };
          this.statistics.push(all);

          const draft = {
            label: "Draft",
            type: "draft",
            value: res.data.filter(
              (row: any) =>
                row.isActive == 1 &&
                (!row.isCompleted || (row.isCompleted == (0 || null)) ) &&
                row.isDeleted == 0
            ).length,
          };
          this.statistics.push(draft);

          const notApproved = {
            label: "Not Approved",
            type: "not_approved",
            value: res.data.filter(
              (row: any) =>
                row.isActive == 1 &&
                (row.isApproved == 0 || null) &&
                row.isDeleted == 0
            ).length,
          };
          this.statistics.push(notApproved);

          const notDownloaded = {
            label: "Not Downloaded",
            type: "not_downloaded",
            value: res.data.filter(
              (row: any) =>
                row.isActive == 1 &&
                (row.isDownloaded == 0 || null) &&
                row.isDeleted == 0
            ).length,
          };
          this.statistics.push(notDownloaded);

          const IRNGenerated = {
            label: "IRN Generated",
            type: "irn_generated",
            value: res.data.filter(
              (row: any) =>
                row.isActive == 1 &&
                row.isIRNGenerated == 1 &&
                row.isDeleted == 0
            ).length,
          };
          this.statistics.push(IRNGenerated);

          const completed = {
            label: "Completed",
            type: "completed",
            value: res.data.filter(
              (row: any) =>
                row.isActive == 1 && row.isCompleted == 1 && row.isDeleted == 0
            ).length,
          };
          this.statistics.push(completed);
        } else {
          switch (event) {
            case "all":
              this.rowData = res.data.sort((a, b) => b.createdAt > a.createdAt ? 1 : -1);
              break;

            case "draft":
              this.rowData = res.data.filter(
                (row: any) =>
                  row.isActive == 1 &&
                  (row.isCompleted == 0 || null) &&
                  row.isDeleted == 0
              ).sort((a, b) => b.createdAt > a.createdAt ? 1 : -1);
              break;

            case "not_approved":
              this.rowData = res.data.filter(
                (row: any) =>
                  row.isActive == 1 &&
                  (row.isApproved == 0 || null) &&
                  row.isDeleted == 0
              ).sort((a, b) => b.createdAt > a.createdAt ? 1 : -1);
              break;

            case "not_downloaded":
              this.rowData = res.data.filter(
                (row: any) =>
                  row.isActive == 1 &&
                  (row.isDownloaded == 0 || null) &&
                  row.isDeleted == 0
              ).sort((a, b) => b.createdAt > a.createdAt ? 1 : -1);
              break;

            case "irn_generated":
              this.rowData = res.data.filter(
                (row: any) =>
                  row.isActive == 1 &&
                  row.isIRNGenerated == 1 &&
                  row.isDeleted == 0
              ).sort((a, b) => b.createdAt > a.createdAt ? 1 : -1);
              break;

            case "completed":
              this.rowData = res.data.filter(
                (row: any) =>
                  row.isActive == 1 &&
                  row.isCompleted == 1 &&
                  row.isDeleted == 0
              ).sort((a, b) => b.createdAt > a.createdAt ? 1 : -1);
              break;

            default:
              this.rowData = res.data.sort((a, b) => b.createdAt > a.createdAt ? 1 : -1);
              break;
          }
        }
      }
    });
  }

  // Dashboard API
  getAllStatisticsData(event?: any) {
    this.dashboardService.getAllStatisticsData(event).subscribe((res: any) => {
      if (res) {
        this.statistics = res;
        this.statistics[0].value = this.invoiceData.length;
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
