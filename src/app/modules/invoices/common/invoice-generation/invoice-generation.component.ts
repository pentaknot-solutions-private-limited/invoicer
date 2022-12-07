import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { InvoicesConfigs } from "src/app/configs/plugin-components/invoices.config";
import { PMRStepperComponent } from "src/app/shared/components/pmr-stepper/pmr-stepper.component";
import { IPMRStepperConfig } from "src/app/shared/components/pmr-stepper/pmr-stepper.model";
import { VSAGridComponent } from "src/app/shared/components/vsa-grid/vsa-grid.component";
import { convertAmountToWords } from "src/app/shared/utils/convert-amount-to-words";
import { InvoiceGenerationService } from "src/app/shared/_http/invoice-generation.service";
import {
  BankDetails,
  BasicDetails,
  CompanyDetails,
  ConsignmentDetails,
  LineItem,
  LocationModel,
  RateDetails,
  ShipmentDetails,
} from "./invoice-generation.model";

import jsPDF from "jspdf";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from "html-to-pdfmake";
import html2canvas from "html2canvas";
import { VSAToastyService } from "src/app/shared/components/vsa-toasty/vsa-toasty/vsa-toasty.service";
import { FilterService } from "primeng/api";
import { AutoComplete } from "primeng/autocomplete";
import * as _ from "lodash";
import { minLengthArray } from "src/app/shared/utils/custom-validators";
import { InvoicePDF } from "src/app/shared/invoice-template/view-invoice-template";
import { PdfViewerComponent } from "ng2-pdf-viewer";

@Component({
  selector: "invoice-generation",
  templateUrl: "./invoice-generation.component.html",
  styleUrls: ["./invoice-generation.component.scss"],
})
export class InvoiceGenerationComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() invoiceData?: any;
  @Input() invoiceDrawerType: string;
  @Output() onBtnClick: EventEmitter<any> = new EventEmitter();

  // View Child
  @ViewChild("stepper", { static: false })
  stepper: PMRStepperComponent;
  @ViewChild("companyDetails", { static: false })
  companyDetails: TemplateRef<any>;
  @ViewChild("shipmentDetails", { static: false })
  shipmentDetails: TemplateRef<any>;
  @ViewChild("consignmentDetails", { static: false })
  consignmentDetails: TemplateRef<any>;
  @ViewChild("rates", { static: false }) rates: TemplateRef<any>;
  @ViewChild("bankDetails", { static: false }) bankDetails: TemplateRef<any>;
  @ViewChild("preview", { static: false }) preview: TemplateRef<any>;
  @ViewChild("pdfTable") pdfTable: ElementRef;
  @ViewChild("pdfViewer") pdfViewer: PdfViewerComponent;

  @ViewChild("autoItems", { static: true }) public autoItems: AutoComplete;

  // Configs
  baseConfig = new InvoicesConfigs();
  stepperConfig: IPMRStepperConfig = {
    steps: [
      {
        stepLabel: "Basic Details",
        stepTemplate: null,
      },
      { stepLabel: "Shipment Details", stepTemplate: null },
      // { stepLabel: "Consignment Details", stepTemplate: null },
      { stepLabel: "Rates", stepTemplate: null },
      // { stepLabel: "Bank Details", stepTemplate: null },
      { stepLabel: "Preview", stepTemplate: null },
    ],
  };
  companyDetailConfig = {
    organizationConfig: this.baseConfig.organizationSelectorConfig,
    branchSelectorConfig: this.baseConfig.branchSelectorConfig,
    customerSelectorConfig: this.baseConfig.customerSelectorConfig,
    customerBranchSelectorConfig: this.baseConfig.customerBranchSelectorConfig,
    invoiceNoGenerationInputConfig: this.baseConfig.invoiceNoGenerationInput,
    invoiceDateInputConfig: this.baseConfig.invoiceDateInput,
    invoiceDueDateInputConfig: this.baseConfig.invoiceDueDateInput,
  };

  shipmentDetailConfig = {
    awbNo: this.baseConfig.awbNoInput,
    dispatchDocNo: this.baseConfig.dispatchDocNoInput,
    sbNo: this.baseConfig.sbNoInput,
    packageQty: this.baseConfig.packageQtyInput,
    //
    chargeableWt: this.baseConfig.chargeableWtInput,
    grossWt: this.baseConfig.grossWtInput,
    netWt: this.baseConfig.netWtInput,
    volume: this.baseConfig.volumeInput,
    //
    date1: this.baseConfig.date1Input,
    date2: this.baseConfig.date2Input,
    departureDate: this.baseConfig.departureDateInput,
    cargoTypeConfig: this.baseConfig.cargoTypeSelectorConfig,
    //
    airlineConfig: this.baseConfig.airlineSelectorConfig,
    flightNo: this.baseConfig.flightNoInput,
    shipperRef: this.baseConfig.shipperRefInput,
    incoTerms: this.baseConfig.incoTermsInput,
  };

  consignmentDetailConfig = {
    shipper: this.baseConfig.shipperSelect,
    consignee: this.baseConfig.consigneeSelect,
    recieptCountry: this.baseConfig.recieptCountrySelect,
    recieptState: this.baseConfig.recieptStateSelect,
    recieptCity: this.baseConfig.recieptCitySelect,
    deliveryCountry: this.baseConfig.deliveryCountrySelect,
    deliveryState: this.baseConfig.deliveryStateSelect,
    deliveryCity: this.baseConfig.deliveryCitySelect,
    loadingPort: this.baseConfig.loadingPortSelect,
    dischargePort: this.baseConfig.dischargePortSelect,
    destinationPort: this.baseConfig.destinatonPortSelect,
    destinationPortCountry: this.baseConfig.destinatonPortCountrySelect,
  };

  rateDetailsConfig = {
    serviceTypeConfig: this.baseConfig.serviceTypeSelectorConfig,
    hsnCode: this.baseConfig.hsnCodeInput,
    currencyConfig: this.baseConfig.currencySelectorConfig,
    quantity: this.baseConfig.quantityInput,
    rate: this.baseConfig.rateInput,
    amount: this.baseConfig.amountInput,
    cgstRate: this.baseConfig.cgstRateInput,
    sgstRate: this.baseConfig.sgstRateInput,
    igstRate: this.baseConfig.igstRateInput,
    taxableAmount: this.baseConfig.taxableAmountInput,
    totalAmount: this.baseConfig.totalAmountInput,
    amountInWords: this.baseConfig.amountInWordsInput,
    unitConfig: this.baseConfig.unitConfig,
  };

  bankDetailsConfig = {
    bankName: this.baseConfig.bankNameInput,
    bankBranch: this.baseConfig.bankBranchInput,
    acNo: this.baseConfig.acNoInput,
    ifscCode: this.baseConfig.ifscCodeInput,
    swiftCode: this.baseConfig.swiftCodeInput,
  };

  // Form Control
  shipmentDetailsForm: FormGroup = new FormGroup({
    invoiceId: new FormControl("", Validators.required),
    invoiceDate: new FormControl("", Validators.required),
    invoiceDueDate: new FormControl("", Validators.required),
    //
    mawbNo: new FormControl("", Validators.required),
    dispatchDocNo: new FormControl("", Validators.required),
    sbNo: new FormControl("", Validators.required),
    packageQty: new FormControl("", Validators.required),
    //
    chargeableWt: new FormControl("", Validators.required),
    grossWt: new FormControl("", Validators.required),
    netWt: new FormControl("", Validators.required),
    volume: new FormControl("", Validators.required),
    //
    date1: new FormControl("", Validators.required),
    date2: new FormControl("", Validators.required),
    departureDate: new FormControl("", Validators.required),
    cargoTypeId: new FormControl("", Validators.required),
    //
    airlineId: new FormControl("", Validators.required),
    flightNo: new FormControl("", Validators.required),
    shipperRef: new FormControl("", Validators.required),
    incoTerms: new FormControl("", Validators.required),
  });

  // consignmentDetailsForm: FormGroup = new FormGroup({
  //   shipper: new FormControl("", Validators.required),
  //   consignee: new FormControl("", Validators.required),
  //   placeOfReciept: new FormControl("", Validators.required),
  //   loadingPort: new FormControl("", Validators.required),
  //   dischargePort: new FormControl("", Validators.required),
  //   placeOfDelivery: new FormControl("", Validators.required),
  //   destinationPort: new FormControl("", Validators.required),
  // });

  rateDetailsForm: FormGroup = new FormGroup({
    serviceTypeId: new FormControl("", Validators.required),
    hsnCode: new FormControl("", Validators.required),
    currencyId: new FormControl("", Validators.required),
    quantity: new FormControl("", Validators.required),
    rate: new FormControl("", Validators.required),
    amount: new FormControl("", Validators.required),
    cgstRate: new FormControl("", Validators.required),
    sgstRate: new FormControl("", Validators.required),
    igstRate: new FormControl("", Validators.required),
    taxableAmount: new FormControl("", Validators.required),
    totalAmount: new FormControl("", Validators.required),
    amountInWords: new FormControl("", Validators.required),
  });

  bankDetailsForm: FormGroup = new FormGroup({
    bankName: new FormControl("", Validators.required),
    bankBranch: new FormControl("", Validators.required),
    acNo: new FormControl("", Validators.required),
    ifscCode: new FormControl("", Validators.required),
    swiftCode: new FormControl("", Validators.required),
  });

  // Variables
  currentStepIndex: number = 0;
  rowData: any[] = [];
  filteredData: any[] = [];
  disabled: boolean = true;
  editMode: boolean = false;
  disableNext: boolean = false;
  disablePlaceOfRecieptState: boolean = true;
  disablePlaceOfRecieptCity: boolean = true;
  downloadLoading: boolean = false;
  invoiceDetails: any; //Temporary
  companyDetailsModel: CompanyDetails = new CompanyDetails();
  shipmentDetailsModel: ShipmentDetails = new ShipmentDetails();
  consignmentDetailsModel: ConsignmentDetails = new ConsignmentDetails();
  rateDetailsModel: RateDetails = new RateDetails();
  bankDetailsModel: BankDetails = new BankDetails();
  locationModel: LocationModel = new LocationModel();
  basicDetailsModel: BasicDetails = new BasicDetails();
  countryPlaceOfRecieptData: any[] = [];
  statePlaceOfRecieptData: any[] = [];
  citiesPlaceOfRecieptData: any[] = [];
  groupedData: any[] = [];
  selectedPlaceOfRecieptCountry: any = "";
  selectedPlaceOfRecieptState: any = "";
  selectedPlaceOfRecieptCity: any = "";
  selectedPlaceOfDeliveryCountry: any = "";
  selectedPlaceOfDeliveryState: any = "";
  selectedPlaceOfDeliveryCity: any = "";
  organizationName = "UNIFIED LOGISTICS SOLUTIONS PRIVATE LIMITED";
  customerName = "QWERTY India Ltd.";
  cargoType = "Airways";
  airline = "Air India";
  serviceType = "AIR";
  currency = "INR";
  lineItemForm: FormGroup;
  lineItemListForm: FormArray;
  lineItems: LineItem[] = [];
  lineItemFormConfigList = [];
  lineItemFormConfig = {
    serviceTypeConfig: this.baseConfig.serviceTypeSelectorConfig,
    unitConfig: this.baseConfig.unitConfig,
    packageQty: this.baseConfig.packageQtyInput,
    chargeableWt: this.baseConfig.chargeableWtInput,
    rate: this.baseConfig.rateInput,
    amount: this.baseConfig.amountInput,
  };
  calc = 0;
  serviceTypeData: any[] = [];

  dummyPayload = {
    companyDetails: {
      organizationId: 1,
      organizationBranchId: 1,
      customerId: 1,
      customerBranchId: 1,
      companyCode: "ULS",
      cityCode: "BOM",
    },
    shipmentDetails: {
      shipperId: 1,
      consigneeId: 1,
      awbNo: "049-00028825",
      flightNo: "3L-102",
      departureDate: "2022-12-05T05:22:53.000Z",
      loadingPortId: 1,
      destinatonPortId: 1,
      dispatchDocNo: "M03014",
      packageQty: 1200,
      chargeableWt: 100,
      grossWt: 1300,
      cargoTypeId: 1,
    },
    rateDetails: {
      invoiceItems: [
        {
          serviceTypeId: 1,
          quantity: 12,
          unitId: 1,
          rate: 2,
          invoiceId: null,
        },
        {
          serviceTypeId: 2,
          quantity: 12,
          unitId: 2,
          rate: 3,
          invoiceId: null,
        },
      ],
      amount: 60,
      cgstRate: 0,
      sgstRate: 0,
      igstRate: 18,
      taxableAmount: 10.8,
      totalAmount: 71,
      amountInWords: "Seventy One",
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
    invoiceNo: "ULS/22120001/BOM",
    invoiceDate: "2022-12-05T05:22:53.000Z",
    invoiceDueDate: "2022-12-05T05:22:53.000Z",
  };
  portData: any;
  srcdata: any;

  constructor(
    private invoiceGenerationService: InvoiceGenerationService,
    private toasty: VSAToastyService,
    private filterService: FilterService,
    private fb: FormBuilder
  ) {
    // Set Initial Values
    this.setInitValues();
    this.lineItemForm = this.fb.group({
      lineItemList: this.fb.array([], minLengthArray(1)),
    });
    this.createLineItemForm();
  }

  getControl(lineItem: FormGroup, controlName: string) {
    return lineItem.get(controlName) as FormControl;
  }

  createLineItemForm() {
    return this.fb.group({
      serviceTypeId: [""],
      hsnCode: [""],
      packageQty: new FormControl(""),
      chargeableWt: new FormControl(""),
      quantity: [""],
      unitId: [""],
      rate: [""],
    });

    // this.shipmentDetailsModel.packageQty
    // this.shipmentDetailsModel.chargeableWt
  }

  setInitValues() {
    this.rateDetailsModel.cgstRate = ""; //0.09;
    this.rateDetailsModel.sgstRate = ""; //0.09;
    this.rateDetailsModel.igstRate = "18%";
    // Temp
    this.consignmentDetailsModel.placeOfDeliveryId = 1;
    this.consignmentDetailsModel.placeOfRecieptId = 1;
    // Invoice No.
    this.basicDetailsModel.invoiceNo = "-";
  }

  ngOnInit(): void {
    this.getAllOrganization();
    this.getAllCustomer();
    this.getMyAccountDetails();
    this.getAllCargoTypes();
    this.getAllAirlines();
    this.getAllCurrency();
    this.getAllCountryData();
    this.getAllServiceType();
    this.getAllShippers();
    this.getAllConsignees();
    this.getAllPorts();
    this.getAllUnitData();
    this.onAddNewLineItemClick(true);
    setTimeout(() => {
      this.getAllBranchByOrgId();
      this.getAllBranchByCustomerId();
    }, 500);

    new InvoicePDF({ invoiceData: null }).getArrayBuffer().then((data) => {
      
    });

    new InvoicePDF({ invoiceData: null }).getBase64().then((data) => {
      this.setDataUrl(data);
      
    });
  }

  setDataUrl(dataUrl) {
    // const obj = {
    //   data: dataUrl
    // }
    this.srcdata = "data:application/pdf;base64,"+dataUrl;
    // this.srcdata = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
    setTimeout(() => {
      console.log(this.pdfViewer);
    }, 100);
    
  }

  test(event) {
    console.log(event);
    
  }

  ngOnChanges() {
    if (this.invoiceData) {
      console.log(this.invoiceData);
    }

    if (this.invoiceDrawerType == "view") {
      this.companyDetailConfig.branchSelectorConfig.attributes.disable = true;
      this.companyDetailConfig.customerBranchSelectorConfig.attributes.disable =
        true;
      this.companyDetailConfig.customerSelectorConfig.attributes.disable = true;
      this.companyDetailConfig.invoiceDateInputConfig.attributes.disable = true;
      this.companyDetailConfig.invoiceDueDateInputConfig.attributes.disable =
        true;
      this.companyDetailConfig.invoiceNoGenerationInputConfig.attributes.disable =
        true;
      this.companyDetailConfig.organizationConfig.attributes.disable = true;

      this.shipmentDetailConfig.airlineConfig.attributes.disable = true;
      this.shipmentDetailConfig.departureDate.attributes.disable = true;
      this.shipmentDetailConfig.cargoTypeConfig.attributes.disable = true;
      this.shipmentDetailConfig.chargeableWt.attributes.disable = true;
      this.shipmentDetailConfig.date1.attributes.disable = true;
      this.shipmentDetailConfig.date2.attributes.disable = true;
      this.shipmentDetailConfig.flightNo.attributes.disable = true;
      this.shipmentDetailConfig.grossWt.attributes.disable = true;
      this.shipmentDetailConfig.dispatchDocNo.attributes.disable = true;
      this.shipmentDetailConfig.incoTerms.attributes.disable = true;
      this.shipmentDetailConfig.awbNo.attributes.disable = true;
      this.shipmentDetailConfig.netWt.attributes.disable = true;
      this.shipmentDetailConfig.packageQty.attributes.disable = true;
      this.shipmentDetailConfig.sbNo.attributes.disable = true;
      this.shipmentDetailConfig.shipperRef.attributes.disable = true;
      this.shipmentDetailConfig.volume.attributes.disable = true;

      this.consignmentDetailConfig.consignee.attributes.disable = true;
      this.consignmentDetailConfig.deliveryCity.attributes.disable = true;
      this.consignmentDetailConfig.deliveryCountry.attributes.disable = true;
      this.consignmentDetailConfig.deliveryState.attributes.disable = true;
      this.consignmentDetailConfig.destinationPort.attributes.disable = true;
      this.consignmentDetailConfig.dischargePort.attributes.disable = true;
      this.consignmentDetailConfig.loadingPort.attributes.disable = true;
      this.consignmentDetailConfig.recieptCity.attributes.disable = true;
      this.consignmentDetailConfig.recieptCountry.attributes.disable = true;
      this.consignmentDetailConfig.recieptState.attributes.disable = true;
      this.consignmentDetailConfig.shipper.attributes.disable = true;

      this.rateDetailsConfig.amount.attributes.disable = true;
      this.rateDetailsConfig.amountInWords.attributes.disable = true;
      this.rateDetailsConfig.cgstRate.attributes.disable = true;
      this.rateDetailsConfig.currencyConfig.attributes.disable = true;
      this.rateDetailsConfig.hsnCode.attributes.disable = true;
      this.rateDetailsConfig.igstRate.attributes.disable = true;
      this.rateDetailsConfig.quantity.attributes.disable = true;
      this.rateDetailsConfig.rate.attributes.disable = true;
      this.rateDetailsConfig.serviceTypeConfig.attributes.disable = true;
      this.rateDetailsConfig.sgstRate.attributes.disable = true;
      this.rateDetailsConfig.taxableAmount.attributes.disable = true;
      this.rateDetailsConfig.totalAmount.attributes.disable = true;
      // consignmentDetailConfigrateDetailsConfig
    } else if (this.invoiceDrawerType == "add") {
      console.log("working add");
      this.stepperConfig.steps = _.cloneDeep(
        this.stepperConfig.steps.map((row: any) => {
          row["isCompleted"] = false;
          return {
            ...row,
          };
        })
      );
    }
    if (this.invoiceData && this.invoiceDrawerType != "add") {
      // Set Stepper Config
      console.log(this.invoiceData);

      this.stepperConfig.steps = _.cloneDeep(
        this.stepperConfig.steps.map((row: any) => {
          row["isCompleted"] = true;
          return {
            ...row,
          };
        })
      );
      // Basic Details
      this.companyDetailsModel.customerBranchId =
        this.invoiceData.companyDetails.customerBranchId;
      this.companyDetailsModel.customerId =
        this.invoiceData.companyDetails.customer.customerId;
      this.basicDetailsModel.invoiceDate = this.invoiceData.invoiceDate;
      this.basicDetailsModel.invoiceDueDate = this.invoiceData.dueDate;
      this.basicDetailsModel.invoiceNo = this.invoiceData.invoiceNo;
      this.companyDetailsModel.organizationBranchId =
        this.invoiceData.companyDetails.organizationBranchId;
      this.companyDetailsModel.organizationId =
        this.invoiceData.companyDetails.organization.id;
      // Shipment Details
      this.shipmentDetailsModel = this.invoiceData.shipmentDetails;
      // Consignment Details
      this.consignmentDetailsModel = this.invoiceData.consignmentDetails;
      // Rate Details
      this.rateDetailsModel = this.invoiceData.rateDetails;
      // this.rateDetailsModel.cgstRate = this.invoiceData.rateDetails.cgstRate
      //   ? `${this.invoiceData.rateDetails.cgstRate}%`
      //   : "";
      // this.rateDetailsModel.sgstRate = this.invoiceData.rateDetails.sgstRate
      //   ? `${this.invoiceData.rateDetails.sgstRate}%`
      //   : "";
      // this.rateDetailsModel.igstRate = this.invoiceData.rateDetails.igstRate
      //   ? `${this.invoiceData.rateDetails.igstRate}%`
      //   : "";
      // Bank Details
      this.bankDetailsModel = this.invoiceData.bankDetails;
    }
  }

  ngOnDestroy(): void {
    this.stepperConfig.steps = [];
  }

  ngAfterViewInit() {
    this.stepperConfig.steps.forEach((step, index) => {
      switch (index) {
        case 0:
          step.stepTemplate = this.companyDetails;
          break;
        case 1:
          step.stepTemplate = this.shipmentDetails;
          break;
        // case 2:
        //   step.stepTemplate = this.consignmentDetails;
        //   break;
        case 2:
          step.stepTemplate = this.rates;
          break;
        // case 3:
        //   step.stepTemplate = this.bankDetails;
        //   break;
        case 3:
          step.stepTemplate = this.preview;
          break;
        default:
          break;
      }
    });
    // console.log(this.stepper);
  }

  get setNextButtonDisabled() {
    if (
      this.currentStepIndex == 1 &&
      (!this.shipmentDetailsModel.shipperId ||
        !this.shipmentDetailsModel.consigneeId ||
        !this.shipmentDetailsModel.awbNo ||
        !this.shipmentDetailsModel.flightNo ||
        !this.shipmentDetailsModel.departureDate ||
        !this.shipmentDetailsModel.loadingPortId ||
        !this.shipmentDetailsModel.destinatonPortId ||
        !this.shipmentDetailsModel.dispatchDocNo ||
        !this.shipmentDetailsModel.packageQty ||
        !this.shipmentDetailsModel.grossWt ||
        !this.shipmentDetailsModel.chargeableWt ||
        !this.basicDetailsModel.invoiceDate ||
        !this.basicDetailsModel.invoiceDueDate)
    ) {
      return true;
    } else if (
      this.currentStepIndex == 2 &&
      (!this.lineItemForm.get("lineItemList").value[0].quantity ||
        !this.lineItemForm.get("lineItemList").value[0].rate)
    ) {
      return true;
    } else {
      return false;
    }
    // else if (
    //   this.currentStepIndex == 1 &&
    //   (!this.shipmentDetailsModel.mawbNo ||
    //     !this.shipmentDetailsModel.dispatchDocNo ||
    //     !this.shipmentDetailsModel.sbNo ||
    //     !this.shipmentDetailsModel.packageQty ||
    //     !this.shipmentDetailsModel.chargeableWt ||
    //     !this.shipmentDetailsModel.grossWt ||
    //     !this.shipmentDetailsModel.netWt ||
    //     !this.shipmentDetailsModel.volume ||
    //     !this.shipmentDetailsModel.date1 ||
    //     !this.shipmentDetailsModel.date2 ||
    //     !this.shipmentDetailsModel.departureDate ||
    //     !this.shipmentDetailsModel.flightNo ||
    //     !this.shipmentDetailsModel.shipperRef ||
    //     !this.shipmentDetailsModel.incoTerms)
    // ) {
    //   return true;
    // } else if (
    //   this.currentStepIndex == 2 &&
    //   (!this.consignmentDetailsModel.shipperId ||
    //     !this.consignmentDetailsModel.consigneeId ||
    //     !this.consignmentDetailsModel.loadingPortId ||
    //     !this.consignmentDetailsModel.dischargePortId ||
    //     !this.consignmentDetailsModel.destinatonPortId ||
    //     !this.consignmentDetailsModel.placeOfDeliveryId ||
    //     !this.consignmentDetailsModel.placeOfRecieptId)
    // ) {
    //   return true;
    // } else if (
    //   this.currentStepIndex == 3 &&
    //   (!this.rateDetailsModel.hsnCode ||
    //     !this.rateDetailsModel.quantity ||
    //     !this.rateDetailsModel.rate)
    // ) {
    //   return true;
    // } else {
    //   return false;
    // }
  }

  onAddNewLineItemClick(isNew) {
    this.lineItemListForm = this.lineItemForm.get("lineItemList") as FormArray;
    this.lineItemListForm.push(this.createLineItemForm());
    const formIndex =
      this.lineItemFormConfigList.push(_.cloneDeep(this.lineItemFormConfig)) -
      1;
    if (isNew) this.lineItems.push(new LineItem());
    this.lineItemFormConfigList[formIndex].serviceTypeConfig.options =
      this.serviceTypeData;
    this.lineItemFormConfigList[formIndex].serviceTypeConfig.attributes.hint =
      "";
    // this.lineItemFormConfigList[formIndex].unitConfig.options =
    //   this.rateDetailsConfig.unitConfig.options;
    // this.lineItems = this.lineItemForm.get("lineItemList").value;
  }

  onDeleteLineItemClick(i) {
    this.lineItemListForm = this.lineItemForm.get("lineItemList") as FormArray;
    this.lineItemFormConfigList.forEach((element, index) => {
      if (index != i) {
        this.lineItemFormConfigList[index].serviceTypeConfig.options =
          this.serviceTypeData.map((row: any) => {
            if (
              row.id ==
              this.lineItemForm.get("lineItemList").value[i].serviceTypeId
            ) {
              row["disabled"] = false;
            }
            return {
              ...row,
            };
          });
      }
    });
    if (
      this.lineItemForm.get("lineItemList").value[i].quantity &&
      this.lineItemForm.get("lineItemList").value[i].rate
    ) {
      this.rateDetailsModel.amount =
        this.rateDetailsModel.amount -
        Number(this.lineItemForm.get("lineItemList").value[i].quantity) *
          Number(this.lineItemForm.get("lineItemList").value[i].rate);
      const igstRateValue =
        Number(this.rateDetailsModel?.igstRate.toString().split("%")[0]) / 100;
      this.rateDetailsModel.taxableAmount =
        Math.round(
          Number(this.rateDetailsModel?.amount) * Number(igstRateValue) * 100
        ) / 100;

      // Update Total Amount
      this.rateDetailsModel.totalAmount = Math.round(
        Number(this.rateDetailsModel?.amount) +
          Number(this.rateDetailsModel?.taxableAmount)
      );
      this.rateDetailsModel.amountInWords = convertAmountToWords(
        Math.round(Number(this.rateDetailsModel?.totalAmount))
      );
    }
    this.lineItemListForm.removeAt(i);
    this.lineItems.splice(i, 1);
    console.log(this.lineItemForm.get("lineItemList").value);
  }

  getLineItem(i) {
    this.lineItems[i].packageQty = this.shipmentDetailsModel.packageQty;
    this.lineItems[i].chargeableWt = this.shipmentDetailsModel.chargeableWt;
    return this.lineItems[i];
  }

  onPcsChanges(event) {
    this.shipmentDetailConfig.packageQty.attributes.disable = true;
  }

  onPackageQuantityChange(event) {
    this.lineItems[0].packageQty = event;
  }

  onChargeableWtChange(event) {
    this.lineItems[0].chargeableWt = event;
  }

  // Drawer Action Events
  actionEvent(event) {
    // let eventData = null;
    switch (event) {
      case "next":
        // Next Click
        console.log(this.currentStepIndex);

        this.stepper.nextStep();
        break;
      case "previous":
        // Previous Click
        this.stepper.prevStep();
        break;
      case "download":
        this.downloadLoading = true;
        // Some process
        this.downloadLoading = false;
        break;
      case "save":
        const bankDetails = {
          bankDetailId: this.bankDetailsModel.id,
          bankName: this.bankDetailsModel.name,
          bankIfscCode: this.bankDetailsModel.ifscCode,
          bankAccountNumber: this.bankDetailsModel.accountNumber,
          bankSwiftCode: this.bankDetailsModel.swiftCode,
        };

        console.log(this.invoiceData);
        const data = {
          id: this.invoiceData?.id ? this.invoiceData?.id : null,
          companyDetails: this.companyDetailsModel,
          shipmentDetails: this.shipmentDetailsModel,
          consignmentDetails: this.consignmentDetailsModel,
          rateDetails: this.rateDetailsModel,
          bankDetails: bankDetails,
          invoiceNo: this.basicDetailsModel.invoiceNo,
          invoiceDate: this.basicDetailsModel.invoiceDate,
          dueDate: this.basicDetailsModel.invoiceDueDate,
          shipmentNo: "",
          shipmentTypeId: 0,
          isCompleted: 1,
        };
        console.log(data);
        this.addUpdateInvoice(data);
        break;
      case "draft":
        const editBankDetails = {
          bankDetailId: this.bankDetailsModel.id,
          bankName: this.bankDetailsModel.name,
          bankIfscCode: this.bankDetailsModel.ifscCode,
          bankAccountNumber: this.bankDetailsModel.accountNumber,
          bankSwiftCode: this.bankDetailsModel.swiftCode,
        };
        this.consignmentDetailsModel.placeOfDeliveryId = 1;
        this.consignmentDetailsModel.placeOfRecieptId = 1;
        const editData = {
          id: this.invoiceData?.id ? this.invoiceData?.id : null,
          companyDetails: this.companyDetailsModel,
          shipmentDetails: this.shipmentDetailsModel,
          consignmentDetails: this.consignmentDetailsModel,
          rateDetails: this.rateDetailsModel,
          bankDetails: editBankDetails,
          invoiceNo: this.basicDetailsModel.invoiceNo,
          invoiceDate: this.basicDetailsModel.invoiceDate,
          dueDate: this.basicDetailsModel.invoiceDueDate,
          shipmentNo: "",
          shipmentTypeId: 0,
          isCompleted: 0,
        };

        this.addUpdateInvoice(editData);
        break;

      default:
        this.onBtnClick.emit("close");
        break;
    }
  }

  selectionChanged(type: any, event?: any, i?: number) {
    switch (type) {
      case "org":
        this.getAllBranchByOrgId();
        this.companyDetailsModel.companyCode = event.selectedObj.companyCode;
        break;
      case "orgBranch":
        this.companyDetailsModel.cityCode = event.selectedObj.cityCode;
        break;
      case "customer":
        this.getAllBranchByCustomerId();
        break;
      case "country":
        this.consignmentDetailConfig.destinationPort.options =
          this.portData?.filter(
            (item: any) =>
              item.isLoadingPort != 1 && item.countryId == event.value
          );
        console.log(
          "port",
          this.portData?.filter(
            (item: any) =>
              item.isLoadingPort != 1 && item.countryId == event.value
          )
        );

        break;
      case "serviceType":
        console.log(event, i);
        this.lineItemForm.get("lineItemList")["controls"][i].patchValue({
          serviceTypeId: event.value,
          hsnCode: event.selectedObj.hsnCode,
        });
        this.lineItemFormConfigList[
          i
        ].serviceTypeConfig.attributes.hint = `HSN Code: ${event.selectedObj.hsnCode}`;
        // this.lineItemFormConfigList.forEach((element, index) => {

        // });
        for (
          let index = 0;
          index < this.lineItemFormConfigList.length;
          index++
        ) {
          const element = this.lineItemFormConfigList[index];
          if (index !== i) {
            this.lineItemFormConfigList[index].serviceTypeConfig.options =
              this.serviceTypeData.map((row: any) => {
                if (row.id == event.value) {
                  row["disabled"] = true;
                }
                return {
                  ...row,
                };
              });
            console.log(
              this.lineItemFormConfigList[index].serviceTypeConfig.options
            );
          }
        }
        break;

      case "unit":
        this.lineItemForm.get("lineItemList")["controls"][i].patchValue({
          unitId: event.value,
        });
        break;
      default:
        break;
    }
  }

  getAmount(quantity, rate): number {
    return Number(quantity) * Number(rate);
  }

  valueChanged(type: any, index: number) {
    console.log(this.calc);
    switch (type) {
      case "quantity":
      case "rate":
        // this.rateDetailsModel.amount
        let temp1: number;
        if (
          this.lineItemForm.get("lineItemList").value[index].quantity &&
          this.lineItemForm.get("lineItemList").value[index].rate
        ) {
          temp1 = this.getAmount(
            Number(this.lineItemForm.get("lineItemList").value[index].quantity),
            Number(this.lineItemForm.get("lineItemList").value[index].rate)
          );
          this.calc += temp1;
        }
        this.rateDetailsModel.amount = this.calc;
        // Update Taxable Amount
        const cgstRateValue =
          Number(this.rateDetailsModel?.cgstRate.toString().split("%")[0]) /
          100;
        const sgstRateValue =
          Number(this.rateDetailsModel?.sgstRate.toString().split("%")[0]) /
          100;
        const igstRateValue =
          Number(this.rateDetailsModel?.igstRate.toString().split("%")[0]) /
          100;
        this.rateDetailsModel.taxableAmount =
          Math.round(
            Number(this.rateDetailsModel?.amount) * Number(igstRateValue) * 100
          ) / 100;

        // Update Total Amount
        this.rateDetailsModel.totalAmount = Math.round(
          Number(this.rateDetailsModel?.amount) +
            Number(this.rateDetailsModel?.taxableAmount)
        );

        // Update Amount in Words
        // const totalAmt = this.rateDetailsModel.totalAmount.toString().split('.')
        // console.log(totalAmt);

        // this.rateDetailsModel.amountInWords = convertAmountToWords(
        //   Number(parseInt(totalAmt[0]))) +"and"+convertAmountToWords(
        //     Number(parseInt(totalAmt[1])));
        this.rateDetailsModel.amountInWords = convertAmountToWords(
          Math.round(Number(this.rateDetailsModel?.totalAmount))
        );
        break;

      default:
        break;
    }
  }

  getNumber(data) {
    return Number(data);
  }

  // API Call
  getAllOrganization() {
    this.invoiceGenerationService.getAllOrganization().subscribe((res: any) => {
      this.companyDetailConfig.organizationConfig.options = res;
      // Set First Value
      if (this.companyDetailConfig.organizationConfig.options?.length > 0) {
        this.companyDetailsModel.organizationId =
          this.companyDetailConfig.organizationConfig.options[0]!.id;
        this.companyDetailsModel.companyCode = res[0].companyCode;
      }
    });
  }
  getAllBranchByOrgId() {
    this.invoiceGenerationService
      .getAllBranchByOrgId(this.companyDetailsModel.organizationId)
      .subscribe((res: any) => {
        this.companyDetailConfig.branchSelectorConfig.options = res.filter(
          (item: any) =>
            item.organizationId === this.companyDetailsModel.organizationId
        );
        // Set First Value
        if (this.companyDetailConfig.branchSelectorConfig.options?.length > 0) {
          this.companyDetailsModel.organizationBranchId =
            this.companyDetailConfig.branchSelectorConfig.options[0]!.id;
          this.companyDetailsModel.cityCode = res[0].cityCode; //cityCode
        }
      });
  }
  // Customer
  getAllCustomer() {
    this.invoiceGenerationService.getAllCustomer().subscribe((res: any) => {
      this.companyDetailConfig.customerSelectorConfig.options = res;
      // Set First Value
      if (this.companyDetailConfig.customerSelectorConfig.options?.length > 0) {
        this.companyDetailsModel.customerId =
          this.companyDetailConfig.customerSelectorConfig.options[0]!.id;
      }
    });
  }
  getAllBranchByCustomerId() {
    // console.log(this.companyDetailsModel);
    this.invoiceGenerationService
      .getAllBranchByCustomerId(this.companyDetailsModel.customerId)
      .subscribe((res: any) => {
        this.companyDetailConfig.customerBranchSelectorConfig.options =
          res.filter(
            (item: any) =>
              item.customerId === this.companyDetailsModel.customerId
          );
        // Set First Value
        if (
          this.companyDetailConfig.customerBranchSelectorConfig.options
            ?.length > 0
        ) {
          this.companyDetailsModel.customerBranchId =
            this.companyDetailConfig.customerBranchSelectorConfig.options[0]!.id;
        }
      });
  }

  // Cargo Details
  getAllCargoTypes() {
    this.invoiceGenerationService.getAllCargoTypes().subscribe((res: any) => {
      this.shipmentDetailConfig.cargoTypeConfig.options = res;
      // Set First Value
      if (this.shipmentDetailConfig.cargoTypeConfig.options?.length > 0) {
        this.shipmentDetailsModel.cargoTypeId =
          this.shipmentDetailConfig.cargoTypeConfig.options[0]!.id;
      }
    });
  }

  // Airline Details
  getAllAirlines() {
    this.invoiceGenerationService.getAllAirlines().subscribe((res: any) => {
      this.shipmentDetailConfig.airlineConfig.options = res.data;
      // Set First Value
      if (this.shipmentDetailConfig.airlineConfig.options?.length > 0) {
        this.shipmentDetailsModel.airlineId =
          this.shipmentDetailConfig.airlineConfig.options[0]!.id;
      }
    });
  }

  // Service Type
  getAllServiceType() {
    this.invoiceGenerationService.getAllServiceType().subscribe((res: any) => {
      this.serviceTypeData = res;
      this.lineItemFormConfigList[0].serviceTypeConfig.options = res;
      // this.rateDetailsConfig.serviceTypeConfig.options = res;
      // // Set First Value
      // if (this.rateDetailsConfig.serviceTypeConfig.options?.length > 0) {
      //   this.lineItems[0].serviceTypeId =
      //     this.rateDetailsConfig.serviceTypeConfig.options[0]!.id;
      // }
    });
  }

  // Currency
  getAllCurrency() {
    this.invoiceGenerationService.getAllCurrency().subscribe((res: any) => {
      this.rateDetailsConfig.currencyConfig.options = res;
      // Set First Value
      if (this.rateDetailsConfig.currencyConfig.options?.length > 0) {
        this.rateDetailsModel.currencyId =
          this.rateDetailsConfig.currencyConfig.options[0]!.id;
      }
    });
  }

  addUpdateInvoice(payload) {
    this.invoiceGenerationService
      .addUpdateInvoice(payload)
      .subscribe((res: any) => {
        this.toasty.success(res.message);
        this.onBtnClick.emit("done");
      });
  }

  // Bank Details
  getMyAccountDetails() {
    this.invoiceGenerationService
      .getMyAccountDetails()
      .subscribe((res: any) => {
        this.bankDetailsModel = res[0];
        console.log(this.bankDetailsModel);
      });
  }

  // Consigement Details

  getAllShippers() {
    this.invoiceGenerationService.getAllShippers().subscribe((res: any) => {
      if (res.data) {
        this.consignmentDetailConfig.shipper.options = res.data;
      }
    });
  }

  getAllConsignees() {
    this.invoiceGenerationService.getAllConsignees().subscribe((res: any) => {
      if (res.data) {
        this.consignmentDetailConfig.consignee.options = res.data;
      }
    });
  }

  getAllPorts() {
    this.invoiceGenerationService.getAllPorts().subscribe((res: any) => {
      if (res.data) {
        this.portData = res.data;
        this.consignmentDetailConfig.loadingPort.options = res.data.filter(
          (item: any) => item.isLoadingPort == 1
        );
        this.consignmentDetailConfig.dischargePort.options = res.data;
      }
    });
  }

  getAllUnitData() {
    this.invoiceGenerationService.getAllUnitData().subscribe((res: any) => {
      if (res.data) {
        this.rateDetailsConfig.unitConfig.options = res.data;
      }
    });
  }

  getAllCountryData() {
    this.invoiceGenerationService
      .getAllCountriesData()
      .subscribe((res: any) => {
        if (res.data) {
          this.consignmentDetailConfig.destinationPortCountry.options =
            res.data;
        }
      });
  }
  // search(event) {
  //   // this.groupedData
  //   let query = event.query;
  //   let filteredGroups = [];

  //   for (let optgroup of this.groupedData) {
  //     let filteredSubOptions = this.filterService.filter(
  //       optgroup.items,
  //       ["label"],
  //       query,
  //       "contains"
  //     );
  //     if (filteredSubOptions && filteredSubOptions.length) {
  //       filteredGroups.push({
  //         label: optgroup.label,
  //         value: optgroup.value,
  //         items: filteredSubOptions
  //       });
  //     }
  //   }

  //   this.filteredData = filteredGroups;
  // }

  // filterCountry(event) {
  //   let filtered: any[] = [];
  //   let query = event.query;
  //   for (let i = 0; i < Country.getAllCountries().length; i++) {
  //     let country = Country.getAllCountries()[i];
  //     if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
  //       filtered.push(country);
  //     }
  //   }

  //   this.countryPlaceOfRecieptData = filtered.map((row: any) => {
  //     return row.name
  //   });
  // }

  // filterState(event) {
  //   let filtered: any[] = [];
  //   let query = event.query;
  //   const countryData = Country.getAllCountries().find((item: any) => item.name == this.selectedPlaceOfRecieptCountry)
  //   const stateData = State.getAllStates().filter((item: any) => item.countryCode == countryData.isoCode)
  //   for (let i = 0; i < stateData.length; i++) {
  //     let state = stateData[i];
  //     if (state.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
  //       filtered.push(state);
  //     }
  //   }

  //   this.statePlaceOfRecieptData = filtered.map((row: any) => {
  //     return row.name
  //   });
  // }

  // filterCities(event) {
  //   let filtered: any[] = [];
  //   let query = event.query;
  //   const countryData = Country.getAllCountries().find((item: any) => item.name == this.selectedPlaceOfRecieptCountry)
  //   const stateData = State.getAllStates().find((item: any) => item.name == this.selectedPlaceOfRecieptState)
  //   const cityData = City.getAllCities().filter((item: any) => item.countryCode == countryData.isoCode && item.stateCode == stateData.isoCode)
  //   for (let i = 0; i < cityData.length; i++) {
  //     let city = cityData[i];
  //     if (city.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
  //       filtered.push(city);
  //     }
  //   }

  //   this.citiesPlaceOfRecieptData = filtered.map((row: any) => {
  //     return row.name
  //   });
  // }

  // filterDeliveryCountry(event) {
  //   let filtered: any[] = [];
  //   let query = event.query;
  //   for (let i = 0; i < Country.getAllCountries().length; i++) {
  //     let country = Country.getAllCountries()[i];
  //     if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
  //       filtered.push(country);
  //     }
  //   }

  //   this.countryPlaceOfRecieptData = filtered.map((row: any) => {
  //     return row.name
  //   });
  // }

  // filterDeliveryState(event) {
  //   let filtered: any[] = [];
  //   let query = event.query;
  //   const countryData = Country.getAllCountries().find((item: any) => item.name == this.selectedPlaceOfDeliveryCountry)
  //   const stateData = State.getAllStates().filter((item: any) => item.countryCode == countryData.isoCode)
  //   for (let i = 0; i < stateData.length; i++) {
  //     let state = stateData[i];
  //     if (state.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
  //       filtered.push(state);
  //     }
  //   }

  //   this.statePlaceOfRecieptData = filtered.map((row: any) => {
  //     return row.name
  //   });
  // }

  // filterDeliveryCities(event) {
  //   let filtered: any[] = [];
  //   let query = event.query;
  //   const countryData = Country.getAllCountries().find((item: any) => item.name == this.selectedPlaceOfDeliveryCountry)
  //   const stateData = State.getAllStates().find((item: any) => item.name == this.selectedPlaceOfDeliveryState)
  //   const cityData = City.getAllCities().filter((item: any) => item.countryCode == countryData.isoCode && item.stateCode == stateData.isoCode)
  //   for (let i = 0; i < cityData.length; i++) {
  //     let city = cityData[i];
  //     if (city.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
  //       filtered.push(city);
  //     }
  //   }

  //   this.citiesPlaceOfRecieptData = filtered.map((row: any) => {
  //     return row.name
  //   });
  // }
}
