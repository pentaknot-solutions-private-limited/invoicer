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
import * as _ from "lodash";
import { convertAmountToWords } from "src/app/shared/utils/convert-amount-to-words";
import { InvoicePDF } from "src/app/shared/invoice-template/new-view-invoice-template";
import * as moment from "moment";
import { InvoiceGenerationService } from "src/app/shared/_http/invoice-generation.service";

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
  invoiceFinalData: any = {};

  policesModel: PolicesModel = new PolicesModel();
  searchInvoiceModel: SearchInvoiceModel = new SearchInvoiceModel();
  entity: string = "";
  usecase: string = "";
  region: string = "";
  selectedStepData: any;
  invoiceData: any;
  invoiceDrawerType: string = "";
  airlineData: any;
  portData: any;

  constructor(
    private invoiceService: InvoiceService,
    private dashboardService: DashboardService,
    private drawerControllerService: DrawerPanelService,
    private invoiceGenerationService: InvoiceGenerationService,
  ) {
    this.invoiceFinalData = {
      companyDetails: {
        organization: {
          name: "",
          address: "",
          gstin: "",
          stateName: "",
          stateTinCode: "",
          emailId: "",
        },
        customer: {
          name: "",
          address: "",
          gstin: "",
          stateName: "",
          stateTinCode: "",
        },
      },
      shipmentDetails: {
        dispatchDocNo: "",
        awbNo: "",
        flightNo: "",
        departureDate: null,
        portCode: "",
        packageQty: 0,
      },
      rateDetails: {
        invoiceItems: [],
        amount: 0,
        igstRate: 0,
        taxableAmount: 0,
        totalAmount: 0,
        amountInWords: "",
      },
      bankDetails: {
        id: 1,
        organizationId: 1,
        name: "AXIS BANK LTD",
        branchName: "Mahim",
        ifscCode: "UTIB0001243",
        accountNumber: "920020018286808",
        swiftCode: "UTIB0001243",
      },
      hsnCodeItems: [],
      hsnListTaxableTotalValue: 0,
      hsnListTaxableTotalAmount: 0,
      hsnTotalValueInWords: "",
      invoiceNo: "",
      invoiceDate: "",
      invoiceDueDate: "",
      ackDate: "",
      ackNo: null,
      qrCode: "",
      irn: "",
    };
  }

  ngOnInit(): void {
    this.getAllPorts()
    this.getAllAirlines()
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
    this.invoiceDrawerType = "view";
    this.getInvoiceById(event.id);
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
    this.invoiceDrawerType = "add";
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
      this.invoiceDrawerType = "edit";
      this.getInvoiceById(event.data.id);
    } else if (event.event == "generate-irn") {
      this.invoiceDrawerType = "view";
      this.getInvoiceById(event.data.id);
    } else {
      this.getInvoiceById(event.data.id, "download");
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
        this.drawerControllerService.setTitle(
          this.invoiceDrawerType == "view"
            ? `View Invoice`
            : this.invoiceDrawerType == "edit"
            ? `Edit Invoice`
            : `Create New Invoice`
        );
        this.drawerControllerService.changeDrawerSize(this.invoiceDrawerType == "view" ? "medium" : "extra-large");
        break;
      default:
        break;
    }
  }

  clearDrawerData() {
    this.invoiceData = {};
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
        this.getInvoices("all", true);
        break;

      default:
        this.clearDrawerData();
        break;
    }
    this.clearDrawerData();
  }

  // Get invoice Data
  getInvoiceData(invoiceData) {
    const airlineData = this.airlineData?.find((item: any) => item.airlineCode == invoiceData?.shipmentDetails?.flightNo?.slice(0, 2))
    const portData = this.portData?.find((item: any) => item.portCode == invoiceData?.shipmentDetails?.portCode)
    this.invoiceFinalData.companyDetails = invoiceData?.companyDetails;
    this.invoiceFinalData.shipmentDetails = invoiceData?.shipmentDetails;
    this.invoiceFinalData.shipmentDetails.dispatchDocNo =
      invoiceData?.shipmentDetails?.dispatchDocNo;
    this.invoiceFinalData.shipmentDetails.awbNo =
      invoiceData?.shipmentDetails?.awbNo;
    this.invoiceFinalData.shipmentDetails.flightNo =
      invoiceData?.shipmentDetails?.flightNo;
    this.invoiceFinalData.shipmentDetails.airlines =
    airlineData?.name;
    this.invoiceFinalData.shipmentDetails.departureDate =
      invoiceData?.shipmentDetails?.departureDate;
    this.invoiceFinalData.shipmentDetails.packageQty =
      invoiceData?.shipmentDetails?.packageQty;
    this.invoiceFinalData.shipmentDetails.chargeableWt =
      invoiceData?.shipmentDetails?.chargeableWt;
      this.invoiceFinalData.shipmentDetails.grossWt =
      invoiceData?.shipmentDetails?.grossWt;
    this.invoiceFinalData.rateDetails.invoiceItems = JSON.parse(
      invoiceData?.invoiceItems
    ).map((row: any) => {
      const data = {
        serviceTypeId: row.serviceTypeId,
        serviceName: row.serviceName,
        hsnCode: row.hsnCode,
        packageQty: invoiceData?.shipmentDetails?.packageQty,
        chargeableWt: invoiceData?.shipmentDetails?.chargeableWt,
        quantity: row.quantity,
        unitId: row.unitId,
        unit: row.unit,
        rate: row.rate,
      };
      return data;
    });

    this.invoiceFinalData.rateDetails.amount = invoiceData?.rateDetails?.amount;
    this.invoiceFinalData.rateDetails.igstRate = Number(
      invoiceData?.rateDetails?.igstRate
    );
    this.invoiceFinalData.invoiceDate = invoiceData?.invoiceDate;
    this.invoiceFinalData.irn = invoiceData?.irn ? invoiceData?.irn : '';
    this.invoiceFinalData.ackDate = invoiceData?.ackDate;
    this.invoiceFinalData.ackNo = invoiceData?.ackNo;
    this.invoiceFinalData.qrCode = invoiceData?.qrCode
      ? invoiceData?.qrCode
      : "";
    this.invoiceFinalData.shipmentDetails.portCode =
      invoiceData?.shipmentDetails?.portCode;
    this.invoiceFinalData.shipmentDetails.placeOfSupply =
      portData ? portData?.placeOfSupply : "";
    this.invoiceFinalData.invoiceNo = invoiceData?.invoiceNo;
    this.invoiceFinalData.rateDetails.taxableAmount =
      invoiceData?.rateDetails?.taxableAmount;
    this.invoiceFinalData.rateDetails.totalAmount =
      invoiceData?.rateDetails?.totalAmount;
    this.invoiceFinalData.rateDetails.amountInWords =
      invoiceData?.rateDetails?.amountInWords;
    const groupedData = _(this.invoiceFinalData?.rateDetails?.invoiceItems)
      .groupBy("hsnCode")
      .value();

    var hsnCodeDataList = [];
    for (let key in groupedData) {
      let amount = 0;
      groupedData[key]?.forEach((element) => {
        amount += Number(element?.quantity) * Number(element?.rate);
        return amount;
      });
      let value = amount;

      const hsnData = {
        hsnCode: key,
        amount: value,
      };
      hsnCodeDataList?.push(hsnData);
    }

    hsnCodeDataList?.map((row) => {
      const igstRateValue = Number(invoiceData?.rateDetails?.igstRate) / 100;
      row["taxableAmount"] =
        Math.round(Number(row?.amount) * Number(igstRateValue) * 100) / 100;
      return { ...row };
    });

    var hsnListTaxableTotalValue = 0;
    hsnCodeDataList?.forEach((element) => {
      hsnListTaxableTotalValue += Number(element?.amount);
      return hsnListTaxableTotalValue;
    });

    var hsnListTaxableTotalAmount = 0;
    hsnCodeDataList?.forEach((element) => {
      hsnListTaxableTotalAmount += Number(element?.taxableAmount);
      return hsnListTaxableTotalAmount;
    });

    this.invoiceFinalData.hsnCodeItems = hsnCodeDataList;
    this.invoiceFinalData.hsnListTaxableTotalValue =
      hsnListTaxableTotalValue.toFixed(2);

    this.invoiceFinalData.hsnListTaxableTotalAmount =
      hsnListTaxableTotalAmount.toFixed(2);
    // const rupeesInWord = convertAmountToWords(
    //   this.invoiceFinalData?.hsnListTaxableTotalAmount?.toString().split(".")[0])
    //   const paiseInWords = convertAmountToWords(
    //     this.invoiceFinalData?.hsnListTaxableTotalAmount?.toString().split(".")[1])
    let hsnTotalValueInWords = `${convertAmountToWords(
      this.invoiceFinalData?.hsnListTaxableTotalAmount?.toString().split(".")[0]
    )} and ${convertAmountToWords(
      this.invoiceFinalData.hsnListTaxableTotalAmount?.toString().split(".")[1]
    )} Paise Only.`;
    this.invoiceFinalData.hsnTotalValueInWords = hsnTotalValueInWords;
    console.log(this.invoiceFinalData);

    new InvoicePDF({ invoiceData: this.invoiceFinalData }).downloadPdf(
      `${invoiceData?.invoiceNo}`
    );
  }

  // API Calls
  getInvoices(event?: string, isFilterChanged?: boolean) {
    const searchFilter = {
      filter: this.selectedFilterType,
      ...this.searchForm.value,
    };
    this.invoiceService.getInvoices(searchFilter).subscribe((res: any) => {
      if (res.data) {
        this.rowData = res.data.sort((a, b) =>
          b.createdAt > a.createdAt ? 1 : -1
        );

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
                (!row.isCompleted || row.isCompleted == (0 || null)) &&
                row.isDeleted == 0
            ).length,
          };
          this.statistics.push(draft);

          const IRNGenerated = {
            label: "IRN Not Generated",
            type: "irn_generated",
            value: res.data.filter(
              (row: any) =>
                row.isActive == 1 &&
                row.isIrnGenerated == 0 &&
                row.isCompleted == 1 &&
                row.isDeleted == 0
            ).length,
          };
          this.statistics.push(IRNGenerated);

          const completed = {
            label: "Completed",
            type: "completed",
            value: res.data.filter(
              (row: any) =>
                row.isActive == 1 && row.isCompleted == 1 && row.isDeleted == 0 && row.isIrnGenerated == 1
            ).length,
          };
          this.statistics.push(completed);
        } else {
          switch (event) {
            case "all":
              this.rowData = res.data.sort((a, b) =>
                b.createdAt > a.createdAt ? 1 : -1
              );
              this.statistics[0].value = res?.data?.length;
              break;

            case "draft":
              this.rowData = res.data
                .filter(
                  (row: any) =>
                    row.isActive == 1 &&
                    (row.isCompleted == 0 || null) &&
                    row.isDeleted == 0
                )
                .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
              this.statistics[1].value = res.data.filter(
                (row: any) =>
                  row.isActive == 1 &&
                  (row.isCompleted == 0 || null) &&
                  row.isDeleted == 0
              ).length;
              break;

            case "not_approved":
              this.rowData = res.data
                .filter(
                  (row: any) =>
                    row.isActive == 1 &&
                    (row.isApproved == 0 || null) &&
                    row.isDeleted == 0
                )
                .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
              break;

            case "not_downloaded":
              this.rowData = res.data
                .filter(
                  (row: any) =>
                    row.isActive == 1 &&
                    (row.isDownloaded == 0 || null) &&
                    row.isDeleted == 0
                )
                .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
              break;

            case "irn_generated":
              this.rowData = res.data
                .filter(
                  (row: any) =>
                    row.isActive == 1 &&
                    row.isIrnGenerated == 0 &&
                    row.isDeleted == 0
                )
                .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
              this.statistics[2].value = res.data.filter(
                (row: any) =>
                  row.isActive == 1 &&
                  row.isIrnGenerated == 0 &&
                  row.isDeleted == 0
              ).length;
              break;

            case "completed":
              this.rowData = res.data
                .filter(
                  (row: any) =>
                    row.isActive == 1 &&
                    row.isCompleted == 1 &&
                    row.isDeleted == 0 && row.isIrnGenerated == 1
                )
                .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
              break;

            default:
              this.rowData = res.data.sort((a, b) =>
                b.createdAt > a.createdAt ? 1 : -1
              );
              break;
          }

          this.statistics[0].value = res?.data?.length;

          this.statistics[1].value = res?.data?.filter(
            (row: any) =>
              row.isActive == 1 &&
              (row.isCompleted == 0 || null) &&
              row.isDeleted == 0
          )?.length;

          this.statistics[2].value = res?.data?.filter(
            (row: any) =>
              row.isActive == 1 &&
              row.isIrnGenerated == 0 &&
              row.isDeleted == 0
          )?.length;

          this.statistics[3].value = res?.data?.filter(
            (row: any) =>
              row.isActive == 1 &&
              row.isCompleted == 1 &&
              row.isDeleted == 0  && row.isIrnGenerated == 1
          )?.length;
        }
      }
      this.clearDrawerData();
    });
  }

  // GET INOVICE BY ID
  getInvoiceById(id, type?: string) {
    this.invoiceService.getInvoiceById(id).subscribe((res: any) => {
      if (res?.data) {
        console.log(res?.data);
        this.invoiceData = res?.data;
        if (type == "download") {
          console.log("working download");
          this.getInvoiceData(this.invoiceData);
        } else {
          console.log("working not download");
          this.openDrawer("invoice-generation");
        }
      }
    });
  }

  getAllAirlines() {
    this.invoiceGenerationService.getAllAirlines().subscribe((res: any) => {
      if (res.data) {
        this.airlineData = res.data;
      }
      
    });
  }

  getAllPorts() {
    this.invoiceGenerationService.getAllPorts().subscribe((res: any) => {
      if (res.data) {
        this.portData = res.data;
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
