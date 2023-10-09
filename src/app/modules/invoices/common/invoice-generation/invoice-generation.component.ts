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
import { InvoicePDF } from "src/app/shared/invoice-template/new-view-invoice-template";
import { PdfViewerComponent } from "ng2-pdf-viewer";
import * as moment from "moment";
import { EncryptedStorage } from "src/app/shared/utils/encrypted-storage";

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
    destinationPort: this.baseConfig.destinationPortSelect,
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
  disabled: boolean = false;
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
  invoiceFinalData: any = {};
  portData: any;
  srcdata: any;
  showPDFTemplate: boolean = false;
  airlineCode: any;
  airlineData: any;
  loggedInUserData: any;
  setCancelDisabled: boolean;

  constructor(
    private invoiceGenerationService: InvoiceGenerationService,
    private toasty: VSAToastyService,
    private filterService: FilterService,
    private fb: FormBuilder
  ) {
    this.getAllOrganization();
    this.getAllCustomer();
    this.getAllPorts();
    this.getMyAccountDetails();
    this.getAllCargoTypes();
    this.getAllAirlines();
    this.getAllCurrency();
    this.getAllCountryData();
    this.getAllServiceType();
    this.getAllShippers();
    this.getAllConsignees();

    this.getAllUnitData();
    // Set Initial Values
    this.setInitValues();
    this.lineItemForm = this.fb.group({
      lineItemList: this.fb.array([], minLengthArray(1)),
    });
    const data = new EncryptedStorage().findItemFromAllStorage("_vsa-u");
    // Get all data from local storage
    this.loggedInUserData = JSON.parse(data);
    this.createLineItemForm();
    this.invoiceFinalData = {
      companyDetails: {
        organization: {
          name: "",
          address: "",
          gstin: "",
          stateName: "",
          stateTinCode: "",
          emailId: "",
          pancardNo: "",
          cinNo: "",
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
        organizationId: 0,
        name: "",
        branchName: "",
        ifscCode: "",
        accountNumber: "",
        swiftCode: "",
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

  getControl(lineItem: FormGroup, controlName: string) {
    return lineItem.get(controlName) as FormControl;
  }

  createLineItemForm(lineItem?: any) {
    return this.fb.group({
      serviceTypeId: [lineItem?.serviceTypeId ? lineItem?.serviceTypeId : ""],
      serviceName: [lineItem?.serviceName ? lineItem?.serviceName : ""],
      hsnCode: [lineItem?.hsnCode ? lineItem?.hsnCode : ""],
      packageQty: new FormControl(""),
      chargeableWt: new FormControl(""),
      quantity: [""],
      unitId: [lineItem?.unitId ? lineItem?.unitId : ""],
      unit: [lineItem?.unit ? lineItem?.unit : ""],
      rate: [""],
    });

    // this.shipmentDetailsModel.packageQty
    // this.shipmentDetailsModel.chargeableWt
  }

  setInitValues() {
    this.rateDetailsModel.cgstRate = ""; //0.09;
    this.rateDetailsModel.sgstRate = ""; //0.09;
    this.rateDetailsModel.igstRate = 18;
    // Temp
    this.consignmentDetailsModel.placeOfDeliveryId = 1;
    this.consignmentDetailsModel.placeOfRecieptId = 1;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.getAllBranchByOrgId();
      this.getAllBranchByCustomerId();
    }, 500);
    if (
      this.invoiceDrawerType === "edit" &&
      JSON.stringify(this.invoiceData) != "{}"
    ) {
      this.invoiceFinalData.companyDetails = this.invoiceData.companyDetails;
    }
  }

  ngOnChanges() {
    if (this.invoiceDrawerType == "add") {
      this.onAddNewLineItemClick(true);
      this.stepperConfig.steps = _.cloneDeep(
        this.stepperConfig.steps.map((row: any) => {
          row["isCompleted"] = false;
          return {
            ...row,
          };
        })
      );
    } else {
      // Set Stepper Config
      console.log(this.invoiceData);
      if (this.invoiceData?.ackDate) {
        const date = moment(this.invoiceData?.ackDate)
          .add(24, "hours")
          .toDate();
        date.setHours(date.getHours() - 5);
        date.setMinutes(date.getMinutes() - 30);
        date.getTime();
        const countdownDate = date.getTime();

        // Update the countdown every second
        const countdownTimer = setInterval(
          () => this.countdownFunction(countdownDate, countdownTimer),
          1000
        ); // update every second
      }
      this.stepperConfig.steps = _.cloneDeep(
        this.stepperConfig.steps.map((row: any) => {
          row["isCompleted"] = true;
          return {
            ...row,
          };
        })
      );
      // Basic Details
      this.companyDetailsModel.organizationId =
        this.invoiceData?.companyDetails?.organization?.id;
      this.companyDetailsModel.customerId =
        this.invoiceData?.companyDetails?.customer?.customerId;
      this.companyDetailsModel.customerBranchId =
        this.invoiceData?.companyDetails?.customerBranchId;
      this.companyDetailsModel.organizationBranchId =
        this.invoiceData.companyDetails.organizationBranchId;

      // Shipment Details
      this.shipmentDetailsModel.shipperId =
        this.invoiceData?.shipmentDetails?.shipperId;
      this.invoiceFinalData.shipmentDetails.shipperName =
        this.invoiceData?.shipmentDetails?.shipperName;
      this.shipmentDetailsModel.consigneeId =
        this.invoiceData?.shipmentDetails?.consigneeId;
      this.invoiceFinalData.shipmentDetails.consigneeName =
        this.invoiceData?.shipmentDetails?.consigneeName;
      this.shipmentDetailsModel.awbNo =
        this.invoiceData?.shipmentDetails?.awbNo;
      this.shipmentDetailsModel.flightNo =
        this.invoiceData?.shipmentDetails?.flightNo;
      this.airlineCode = this.invoiceData?.shipmentDetails?.flightNo.slice(
        0,
        2
      );
      this.shipmentDetailsModel.departureDate =
        this.invoiceData?.shipmentDetails?.departureDate;
      this.shipmentDetailsModel.loadingPortId =
        this.invoiceData?.shipmentDetails?.loadingPortId;
      this.invoiceFinalData.shipmentDetails.loadingPortName =
        this.invoiceData?.shipmentDetails?.loadingPortName;
      this.shipmentDetailsModel.destinationPortId =
        this.invoiceData?.shipmentDetails?.destinationPortId;
      this.invoiceFinalData.shipmentDetails.destinationPortName =
        this.invoiceData?.shipmentDetails?.destinationPortName;
      this.locationModel.countryId =
        this.invoiceData?.shipmentDetails?.portCountryId;
      this.invoiceFinalData.shipmentDetails.portCode =
        this.invoiceData?.shipmentDetails?.portCode;

      this.shipmentDetailsModel.dispatchDocNo =
        this.invoiceData?.shipmentDetails?.dispatchDocNo;
      this.shipmentDetailsModel.packageQty =
        this.invoiceData?.shipmentDetails?.packageQty;
      this.shipmentDetailsModel.grossWt =
        this.invoiceData?.shipmentDetails?.grossWt;
      this.shipmentDetailsModel.chargeableWt =
        this.invoiceData?.shipmentDetails?.chargeableWt;
      this.shipmentDetailsModel.cargoTypeId =
        this.invoiceData?.shipmentDetails?.cargoTypeId;
      this.invoiceFinalData.shipmentDetails.cargoTypeName =
        this.invoiceData?.shipmentDetails?.cargoTypeName;

      // Basic Details
      this.basicDetailsModel.invoiceDate = this.invoiceData?.invoiceDate;
      this.basicDetailsModel.invoiceDueDate = this.invoiceData?.invoiceDueDate;
      this.basicDetailsModel.invoiceNo = this.invoiceData?.invoiceNo;

      // Rate Details
      this.rateDetailsModel.amount = Number(
        this.invoiceData?.rateDetails?.amount
      );
      this.rateDetailsModel.amountInWords =
        this.invoiceData?.rateDetails?.amountInWords;
      this.rateDetailsModel.igstRate = Number(
        this.invoiceData?.rateDetails?.igstRate
      );
      this.rateDetailsModel.cgstRate = Number(
        this.invoiceData?.rateDetails?.cgstRate
      );
      this.rateDetailsModel.sgstRate = Number(
        this.invoiceData?.rateDetails?.sgstRate
      );
      this.rateDetailsModel.taxableAmount = Number(
        this.invoiceData?.rateDetails?.taxableAmount
      );
      this.rateDetailsModel.totalAmount = Number(
        this.invoiceData?.rateDetails?.totalAmount
      );

      // Bank Details
      this.bankDetailsModel = this.invoiceData.bankDetails;
      if (this.invoiceDrawerType == "view") {
        this.lineItems = JSON.parse(this.invoiceData?.invoiceItems);
        setTimeout(() => {
          this.generatePDF();
        }, 500);
      }
    }
  }

  countdownFunction(countdownDate, countdownTimer) {
    const now = new Date().getTime();

    // Calculate the time remaining
    const timeRemaining = countdownDate - now;

    // Calculate the hours, minutes, and seconds remaining
    const hours = Math.floor(
      (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    // Display the time remaining
    if (timeRemaining > 0) {
      this.setCancelDisabled = false;
    } else {
      clearInterval(countdownTimer);
      this.setCancelDisabled = true;
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
        case 2:
          step.stepTemplate = this.rates;
          break;
        case 3:
          step.stepTemplate = this.preview;
          break;
        default:
          break;
      }
    });
    // console.log(this.stepper);
  }

  onFlightNoEntered(event) {
    if (event.length >= 2) {
      this.airlineCode = event.slice(0, 2);
      this.shipmentDetailConfig.flightNo.attributes.errorMessage =
        "Invalid airline number.";
      const portData = this.airlineData?.find(
        (item: any) => item?.airlineCode == this.airlineCode
      );
      console.log(portData);

      if (portData) {
        this.shipmentDetailConfig.flightNo.attributes.errorMessage = "";
        this.disabled = false;
      } else {
        this.shipmentDetailConfig.flightNo.attributes.errorMessage =
          "Invalid airline number.";
        this.disabled = true;
      }
    }
  }

  // onDateSelected(type,event) {
  //   switch (type) {
  //     case 'departureDate':
  //       this.shipmentDetailsModel.departureDate = moment(event).format("DD/MM/YYYY")
  //       console.log(this.shipmentDetailsModel.departureDate);

  //       break;

  //     default:
  //       break;
  //   }
  // }

  get setNextButtonDisabled() {
    if (
      this.currentStepIndex == 1 &&
      // !this.shipmentDetailsModel.shipperId ||
      (!this.shipmentDetailsModel.awbNo ||
        !this.shipmentDetailsModel.flightNo ||
        !this.shipmentDetailsModel.departureDate ||
        !this.shipmentDetailsModel.loadingPortId ||
        !this.shipmentDetailsModel.destinationPortId ||
        // !this.shipmentDetailsModel.dispatchDocNo ||
        !this.shipmentDetailsModel.packageQty ||
        !this.shipmentDetailsModel.grossWt ||
        !this.shipmentDetailsModel.chargeableWt ||
        !this.basicDetailsModel.invoiceDate ||
        !this.basicDetailsModel.invoiceNo)
    ) {
      return true;
    } else if (
      this.currentStepIndex == 2 &&
      (!this.lineItems[0].quantity || !this.lineItems[0].rate)
    ) {
      return true;
    } else if (
      this.currentStepIndex == 3 &&
      (!this.lineItems[0].quantity ||
        !this.lineItems[0].rate ||
        // !this.shipmentDetailsModel.shipperId ||
        !this.shipmentDetailsModel.awbNo ||
        !this.shipmentDetailsModel.flightNo ||
        !this.shipmentDetailsModel.departureDate ||
        !this.shipmentDetailsModel.loadingPortId ||
        !this.shipmentDetailsModel.destinationPortId ||
        // !this.shipmentDetailsModel.dispatchDocNo ||
        !this.shipmentDetailsModel.packageQty ||
        !this.shipmentDetailsModel.grossWt ||
        !this.shipmentDetailsModel.chargeableWt ||
        !this.basicDetailsModel.invoiceDate ||
        !this.basicDetailsModel.invoiceNo)
    ) {
      return true;
    } else {
      return false;
    }
  }

  onAddNewLineItemClick(isNew) {
    this.lineItemListForm = this.lineItemForm.get("lineItemList") as FormArray;
    const formIndex =
      this.lineItemFormConfigList.push(_.cloneDeep(this.lineItemFormConfig)) -
      1;
    this.lineItemFormConfigList[formIndex].serviceTypeConfig.options =
      formIndex == 0
        ? this.serviceTypeData
        : this.getServiceTypeData(
            true,
            this.lineItemForm.get("lineItemList").value[formIndex - 1]
              .serviceTypeId
          );

    this.lineItemListForm.push(this.createLineItemForm());

    if (isNew) this.lineItems.push(new LineItem());

    this.lineItemFormConfigList[formIndex].serviceTypeConfig.attributes.hint =
      "";
  }

  loadLineItems(lineItem) {
    console.log(lineItem);

    this.lineItemListForm = this.lineItemForm.get("lineItemList") as FormArray;
    const formIndex =
      this.lineItemFormConfigList.push(_.cloneDeep(this.lineItemFormConfig)) -
      1;
    this.lineItemFormConfigList[formIndex].serviceTypeConfig.options =
      this.getServiceTypeData(true, lineItem?.serviceTypeId);

    setTimeout(() => {
      console.log(
        this.lineItemFormConfigList[formIndex].serviceTypeConfig.options
      );
      this.lineItemListForm.push(this.createLineItemForm(lineItem));
      this.lineItems.push(lineItem);
    }, 500);
    // this.lineItemForm.get("lineItemList")["controls"][formIndex].patchValue({
    //   serviceTypeId: lineItems.serviceTypeId,
    //   hsnCode: lineItems.hsnCode,
    //   serviceName: lineItems.serviceName,
    // });
    // this.lineItemForm.get("lineItemList")["controls"][formIndex].patchValue({
    //   unitId: lineItems.unitId,
    //   unit: lineItems.unit,
    // });
    this.lineItemFormConfigList[
      formIndex
    ].serviceTypeConfig.attributes.hint = `HSN Code: ${lineItem?.hsnCode}`;
  }

  onDeleteLineItemClick(i) {
    this.lineItemListForm = this.lineItemForm.get("lineItemList") as FormArray;
    if (
      this.lineItemForm.get("lineItemList").value[i].quantity &&
      this.lineItemForm.get("lineItemList").value[i].rate
    ) {
      this.rateDetailsModel.amount =
        this.rateDetailsModel.amount -
        Number(this.lineItemForm.get("lineItemList").value[i].quantity) *
          Number(this.lineItemForm.get("lineItemList").value[i].rate);
      // const igstRateValue =
      //   this.invoiceData?.companyDetails?.customer?.stateName ==
      //   this.invoiceData?.companyDetails?.organizationBranch?.stateName
      //     ? (Number(this.rateDetailsModel?.sgstRate.toString().split("%")[0]) +
      //         Number(
      //           this.rateDetailsModel?.cgstRate.toString().split("%")[0]
      //         )) /
      //       100
      //     : Number(this.rateDetailsModel?.igstRate.toString().split("%")[0]) /
      //       100;
      const cgstRateValue =
        Number(this.rateDetailsModel?.cgstRate.toString().split("%")[0]) / 100;
      const sgstRateValue =
        Number(this.rateDetailsModel?.sgstRate.toString().split("%")[0]) / 100;
      const igstRateValue =
        Number(this.rateDetailsModel?.igstRate.toString().split("%")[0]) / 100;
      this.rateDetailsModel.taxableAmount =
        Math.round(
          Number(this.rateDetailsModel?.amount) *
            (this.invoiceFinalData?.companyDetails?.customer?.stateName ==
            this.invoiceFinalData?.companyDetails?.organization?.stateName
              ? Number(cgstRateValue) + Number(sgstRateValue)
              : Number(igstRateValue)) *
            100
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
    const serviceTypeId =
      this.lineItemForm.get("lineItemList").value[i].serviceTypeId;

    this.lineItemListForm.removeAt(i);
    this.lineItems.splice(i, 1);
    this.lineItemFormConfigList.splice(i, 1);
    this.getServiceTypeData(false, serviceTypeId);
    // this.lineItemFormConfigList.map((row: any) => {
    //   row.serviceTypeConfig.options = this.getServiceTypeData(false, serviceTypeId)
    //   return {
    //     ...row
    //   }
    // })
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

  generatePDF() {
    new InvoicePDF({ invoiceData: this.getInvoiceData() })
      .getBase64()
      .then((data) => {
        this.setDataUrl(data);
        this.showPDFTemplate = true;
      });
  }

  setDataUrl(dataUrl) {
    this.srcdata = "data:application/pdf;base64," + dataUrl;
  }

  getServiceTypeData(isUsed: boolean, id) {
    return this.serviceTypeData?.map((row: any) => {
      if (row.id == id) {
        row["disabled"] = isUsed ? true : false;
      }
      return {
        ...row,
      };
    });
  }

  // Drawer Action Events
  actionEvent(event) {
    // let eventData = null;
    let data: any = {};
    switch (event) {
      case "next":
        // Next Click
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
        data = this.generatePostData();
        data.isCompleted = this.invoiceData?.isCompleted
          ? this.invoiceData?.isCompleted
          : 1;
        this.addUpdateInvoice(data);
        break;
      case "draft":
        data = this.generatePostData();
        data.isCompleted = this.invoiceData?.isCompleted
          ? this.invoiceData?.isCompleted
          : 0;
        this.addUpdateInvoice(data);
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
        this.companyDetailsModel.companyCode = event?.selectedObj?.companyCode;
        this.invoiceFinalData.companyDetails.organization.name =
          event?.selectedObj?.name;
        this.invoiceFinalData.companyDetails.organization.emailId =
          event?.selectedObj?.emailId;
        break;
      case "orgBranch":
        // this.getAllBranchByOrgId();
        this.companyDetailsModel.cityCode = event.selectedObj.cityCode;
        this.invoiceFinalData.companyDetails.organization.address =
          event?.selectedObj?.address;
        this.invoiceFinalData.companyDetails.organization.gstin =
          event?.selectedObj?.gstin;
        this.invoiceFinalData.companyDetails.organization.stateName =
          event?.selectedObj?.stateName;
        this.invoiceFinalData.companyDetails.organization.stateTinCode =
          event?.selectedObj?.stateTinCode;
        console.log(this.invoiceFinalData, "invoiceFinalData");
        this.calculateGst();
        break;
      case "customer":
        this.getAllBranchByCustomerId();
        this.invoiceFinalData.companyDetails.customer.name =
          event?.selectedObj?.name;
        break;
      case "customerBranch":
        this.getAllBranchByCustomerId();
        this.invoiceFinalData.companyDetails.customer.address =
          event?.selectedObj?.address;
        this.invoiceFinalData.companyDetails.customer.address2 =
          event?.selectedObj?.address2;
        this.invoiceFinalData.companyDetails.customer.gstin =
          event?.selectedObj?.gstin;
        this.invoiceFinalData.companyDetails.customer.stateName =
          event?.selectedObj?.stateName;
        this.invoiceFinalData.companyDetails.customer.stateTinCode =
          event?.selectedObj?.stateTinCode;
        this.calculateGst();
        break;
      case "country":
        this.consignmentDetailConfig.destinationPort.options =
          this.portData?.filter(
            (item: any) =>
              item.isLoadingPort != 1 && item.countryId == event.value
          );

        break;
      case "destinationPort":
        this.invoiceFinalData.shipmentDetails.portCode =
          event?.selectedObj?.portCode;
        this.invoiceFinalData.shipmentDetails.destinationPortName =
          event?.selectedObj?.name;
        this.invoiceFinalData.shipmentDetails.placeOfSupply =
          event?.selectedObj?.placeOfSupply;
        break;
      case "loadingPort":
        this.invoiceFinalData.shipmentDetails.loadingPortName =
          event?.selectedObj?.name;
        break;
      case "serviceType":
        console.log(event);
        this.lineItemFormConfigList[
          i
        ].serviceTypeConfig.attributes.hint = `HSN Code: ${event.selectedObj.hsnCode}`;

        this.lineItemForm.get("lineItemList")["controls"][i].patchValue({
          serviceTypeId: event.value,
          hsnCode: event.selectedObj.hsnCode,
          serviceName: event.selectedObj.name,
        });
        break;

      case "unit":
        this.lineItemForm.get("lineItemList")["controls"][i].patchValue({
          unitId: event.value,
          unit: event.selectedObj.unit,
        });
        break;
      case "shipper":
        this.invoiceFinalData.shipmentDetails.shipperName =
          event?.selectedObj?.name;
        break;
      case "consignee":
        this.invoiceFinalData.shipmentDetails.consigneeName =
          event?.selectedObj?.name;
        break;
      case "cargoType":
        this.invoiceFinalData.shipmentDetails.cargoTypeName =
          event?.selectedObj?.name;
        break;
      default:
        break;
    }
  }

  getAmount(quantity, rate): number {
    return Number(quantity) * Number(rate);
  }

  calculateAmount(array) {
    const initialValue = 0;
    const sumWithInitial = array.reduce(
      (accumulator, currentValue) =>
        accumulator + Number(currentValue.quantity) * Number(currentValue.rate),
      initialValue
    );
    return sumWithInitial;
  }

  valueChanged(type: any, index: number) {
    console.log(this.calc);
    switch (type) {
      case "quantity":
      case "rate":
        console.log("rate is changed");

        this.rateDetailsModel.amount = this.calculateAmount(
          this.lineItemForm.get("lineItemList").value
        );
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
            Number(this.rateDetailsModel?.amount) *
              (this.invoiceFinalData?.companyDetails?.customer?.stateName ==
              this.invoiceFinalData?.companyDetails?.organization?.stateName
                ? Number(cgstRateValue) + Number(sgstRateValue)
                : Number(igstRateValue)) *
              100
          ) / 100;
        console.log(
          this.invoiceData,
          this.invoiceFinalData,
          this.rateDetailsModel
        );

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

  getInvoiceData() {
    // if (this.invoiceData) {
    //   this.invoiceFinalData.companyDetails = this.invoiceData?.companyDetails;
    // }
    const airlineData = this.airlineData?.find(
      (item: any) => item.airlineCode == this.airlineCode
    );
    this.invoiceFinalData.companyDetails = this.invoiceData?.companyDetails
      ? this.invoiceData?.companyDetails
      : this.invoiceFinalData.companyDetails;
    this.invoiceFinalData.shipmentDetails.dispatchDocNo =
      this.shipmentDetailsModel?.dispatchDocNo;
    this.invoiceFinalData.shipmentDetails.awbNo =
      this.shipmentDetailsModel?.awbNo;
    this.invoiceFinalData.shipmentDetails.flightNo =
      this.shipmentDetailsModel?.flightNo;
    this.invoiceFinalData.shipmentDetails.airlines = airlineData?.name;
    this.invoiceFinalData.shipmentDetails.departureDate =
      this.shipmentDetailsModel?.departureDate;
    this.invoiceFinalData.shipmentDetails.packageQty =
      this.shipmentDetailsModel?.packageQty;
    this.invoiceFinalData.shipmentDetails.chargeableWt =
      this.shipmentDetailsModel?.chargeableWt;
    this.invoiceFinalData.shipmentDetails.grossWt =
      this.shipmentDetailsModel?.grossWt;
    this.invoiceFinalData.rateDetails.invoiceItems =
      this.invoiceDrawerType != "view"
        ? this.lineItemForm.get("lineItemList").value
        : this.lineItems;
    this.invoiceFinalData.rateDetails.amount = this.rateDetailsModel?.amount;
    this.invoiceFinalData.rateDetails.igstRate = Number(
      this.rateDetailsModel?.igstRate.toString().split("%")[0]
    );
    this.invoiceFinalData.rateDetails.cgstRate = Number(
      this.rateDetailsModel?.cgstRate.toString().split("%")[0]
    );
    this.invoiceFinalData.rateDetails.sgstRate = Number(
      this.rateDetailsModel?.sgstRate.toString().split("%")[0]
    );
    this.invoiceFinalData.invoiceDate = this.basicDetailsModel.invoiceDate;
    this.invoiceFinalData.invoiceDueDate =
      this.basicDetailsModel.invoiceDueDate;
    this.invoiceFinalData.invoiceNo = this.basicDetailsModel.invoiceNo;
    this.invoiceFinalData.irn = this.invoiceData?.irn
      ? this.invoiceData?.irn
      : "-";
    this.invoiceFinalData.ackDate = this.invoiceData?.ackDate
      ? moment(this.invoiceData?.ackDate).format("DD-MMM-YYYY")
      : "-";
    this.invoiceFinalData.ackNo = this.invoiceData?.ackNo
      ? this.invoiceData?.ackNo
      : "-";
    this.invoiceFinalData.qrCode = this.invoiceData?.qrCode
      ? this.invoiceData?.qrCode
      : "";
    this.invoiceFinalData.rateDetails.taxableAmount =
      this.rateDetailsModel?.taxableAmount;
    this.invoiceFinalData.rateDetails.totalAmount =
      this.rateDetailsModel?.totalAmount;
    this.invoiceFinalData.rateDetails.amountInWords =
      this.rateDetailsModel?.amountInWords;
    const groupedData = _(
      this.invoiceDrawerType != "view"
        ? this.lineItemForm.get("lineItemList").value
        : this.lineItems
    )
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
      const igstRateValue =
        Number(this.rateDetailsModel?.igstRate?.toString().split("%")[0]) / 100;
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

    let hsnTotalValueInWords = `${convertAmountToWords(
      this.invoiceFinalData?.hsnListTaxableTotalAmount?.toString().split(".")[0]
    )} and ${convertAmountToWords(
      this.invoiceFinalData.hsnListTaxableTotalAmount?.toString().split(".")[1]
    )} Paise Only.`;
    this.invoiceFinalData.hsnTotalValueInWords = hsnTotalValueInWords;
    return this.invoiceFinalData;
  }

  generatePostData() {
    return {
      id: this.invoiceData?.id ? this.invoiceData?.id : null,
      companyDetails: {
        organizationId: this.companyDetailsModel?.organizationId,
        organizationBranchId: this.companyDetailsModel?.organizationBranchId,
        customerId: this.companyDetailsModel?.customerId,
        customerBranchId: this.companyDetailsModel?.customerBranchId,
        companyCode: this.companyDetailsModel?.companyCode,
        cityCode: this.companyDetailsModel?.cityCode,
      },
      shipmentDetails: {
        shipperId: this.shipmentDetailsModel?.shipperId,
        consigneeId: this.shipmentDetailsModel?.consigneeId,
        awbNo: this.shipmentDetailsModel?.awbNo,
        flightNo: this.shipmentDetailsModel?.flightNo,
        departureDate: this.shipmentDetailsModel?.departureDate,
        loadingPortId: this.shipmentDetailsModel?.loadingPortId,
        destinationPortId: this.shipmentDetailsModel?.destinationPortId,
        dispatchDocNo: this.shipmentDetailsModel?.dispatchDocNo,
        packageQty: Number(this.shipmentDetailsModel?.packageQty),
        chargeableWt: Number(this.shipmentDetailsModel?.chargeableWt),
        grossWt: Number(this.shipmentDetailsModel?.grossWt),
        cargoTypeId: this.shipmentDetailsModel?.cargoTypeId,
      },
      rateDetails: {
        invoiceItems:
          this.lineItemForm.get("lineItemList").value || this.lineItems,
        amount: Number(this.rateDetailsModel?.amount),
        cgstRate: Number(
          this.rateDetailsModel?.cgstRate.toString().split("%")[0]
        ),
        sgstRate: Number(
          this.rateDetailsModel?.sgstRate.toString().split("%")[0]
        ),
        igstRate:
          this.rateDetailsModel?.cgstRate && this.rateDetailsModel?.sgstRate
            ? 0
            : Number(this.rateDetailsModel?.igstRate.toString().split("%")[0]),
        taxableAmount: Number(this.rateDetailsModel?.taxableAmount),
        totalAmount: Number(this.rateDetailsModel?.totalAmount),
        amountInWords: this.rateDetailsModel?.amountInWords,
      },
      bankDetails: {
        id: 1,
        organizationId: this.companyDetailsModel?.organizationId,
        name: this.bankDetailsModel?.name,
        branchName: this.bankDetailsModel?.branchName,
        ifscCode: this.bankDetailsModel?.ifscCode,
        accountNumber: this.bankDetailsModel?.accountNumber,
        swiftCode: this.bankDetailsModel?.swiftCode,
      },
      invoiceNo: this.basicDetailsModel?.invoiceNo,
      invoiceDate: this.basicDetailsModel?.invoiceDate,
      invoiceDueDate: this.basicDetailsModel?.invoiceDueDate,
      isApproved: this.invoiceData?.isApproved
        ? this.invoiceData?.isApproved
        : 0,
      isDownloaded: this.invoiceData?.isDownloaded
        ? this.invoiceData?.isDownloaded
        : 0,
      isIrnGenerated: this.invoiceData?.isIrnGenerated
        ? this.invoiceData?.isIrnGenerated
        : 0,
      isCompleted: this.invoiceData?.isCompleted
        ? this.invoiceData?.isCompleted
        : 0,
      irn: this.invoiceData?.irn ? this.invoiceData?.irn : null,
      ackNo: this.invoiceData?.ackNo ? this.invoiceData?.ackNo : null,
      qrCode: this.invoiceData?.qrCode ? this.invoiceData?.qrCode : null,
      ackDate: this.invoiceData?.ackDate ? this.invoiceData?.ackDate : null,
    };
  }

  showDraftButton() {
    if (this.invoiceData) {
      return this.invoiceData?.isCompleted == 1 ? false : true;
    } else {
      return true;
    }
  }

  generateIRNData(invoiceData: any) {
    const lineItems = invoiceData?.rateDetails?.invoiceItems
      ? invoiceData?.rateDetails?.invoiceItems
      : this.lineItems;
    const data = {
      Version: "1.1",
      TranDtls: {
        TaxSch: "GST",
        SupTyp: "B2B",
        RegRev: "N",
        // EcmGstin: null,
        IgstOnIntra: "N",
      },
      DocDtls: {
        No: invoiceData?.invoiceNo,
        Typ: "INV", // Need clarity
        Dt: moment(invoiceData?.invoiceDate).format("DD/MM/YYYY"),
      },

      SellerDtls: {
        Gstin: invoiceData?.companyDetails?.organization?.gstin,
        LglNm: invoiceData?.companyDetails?.organization?.name,
        TrdNm: invoiceData?.companyDetails?.organization?.name,
        Addr1: invoiceData?.companyDetails?.organization?.address,
        Addr2: null,
        Loc: invoiceData?.companyDetails?.organization?.stateName,
        Pin: Number(invoiceData?.companyDetails?.organization?.pincode),
        Stcd: invoiceData?.companyDetails?.organization?.stateTinCode.toString(),
        // Ph: invoiceData?.companyDetails?.organization?.phoneNo,
        Em: invoiceData?.companyDetails?.organization?.emailId,
      },

      BuyerDtls: {
        Gstin: invoiceData?.companyDetails?.customerBranch?.gstin,
        LglNm: invoiceData?.companyDetails?.customer?.customerName,
        // TrdNm: invoiceData?.companyDetails?.customer?.customerName,
        // Pos:
        //   invoiceData?.shipmentDetails?.placeOfSupply !=
        //   "[96] Foreign Countries"
        //     ? Number(
        //         invoiceData?.shipmentDetails?.placeOfSupply
        //           ?.split(" ")[0]
        //           .replace(/[[\]]/g, "")
        //       )
        //     : 97,
        Pos: Number(invoiceData?.companyDetails?.customerBranch?.stateTinCode),
        Addr1: invoiceData?.companyDetails?.customer?.address,
        Addr2: invoiceData?.companyDetails?.customer?.address2,
        Loc: invoiceData?.companyDetails?.customer?.stateName,
        Pin: Number(invoiceData?.companyDetails?.customerBranch?.pincode),
        Stcd: invoiceData?.companyDetails?.customerBranch?.stateTinCode.toString(),
      },

      // DispDtls: {
      //   Nm: invoiceData?.companyDetails?.organization?.name,
      //   Addr1: invoiceData?.companyDetails?.organization?.address,
      //   Addr2: "",
      //   Loc: invoiceData?.companyDetails?.organization?.stateName,
      //   Pin: Number(invoiceData?.companyDetails?.organization?.pincode),
      //   Stcd: invoiceData?.companyDetails?.organization?.stateTinCode.toString(),
      // },
      // this.lineItems
      ItemList: invoiceData?.rateDetails?.invoiceItems?.map(
        (row: any, index: number) => {
          const igstRateValue =
            Number(invoiceData?.rateDetails?.igstRate) / 100;
          const sgstRateValue =
            Number(invoiceData?.rateDetails?.sgstRate) / 100;
          const cgstRateValue =
            Number(invoiceData?.rateDetails?.cgstRate) / 100;
          const gstRateValue = 0.09;
          const igstAmt =
            (Number(row?.quantity) *
              Number(row?.rate) *
              Number(igstRateValue) *
              100) /
            100;
          const cgstAmt =
            (Number(row?.quantity) *
              Number(row?.rate) *
              Number(sgstRateValue) *
              100) /
            100;
          const sgstAmt =
            (Number(row?.quantity) *
              Number(row?.rate) *
              Number(cgstRateValue) *
              100) /
            100;
          const gstAmt =
            (Number(row?.quantity) *
              Number(row?.rate) *
              Number(gstRateValue) *
              100) /
            100;
          const totItemVal =
            Number(row?.quantity) * Number(row?.rate) +
            (invoiceData?.companyDetails?.customer?.stateName ==
            invoiceData?.companyDetails?.organizationBranch?.stateName
              ? Number(cgstAmt) + Number(sgstAmt)
              : Number(igstAmt));
          return {
            SlNo: (index + 1).toString(),
            PrdDesc: row?.serviceName,
            IsServc: "Y",
            HsnCd: row?.hsnCode?.toString(),
            Barcde: "000", // Need Clarity
            Qty: row?.quantity,
            FreeQty: 0, // Need Clarity
            Unit: (row?.unit).toUpperCase(),
            UnitPrice: row?.rate,
            TotAmt: Number(row?.quantity) * Number(row?.rate),
            Discount: 0,
            PreTaxVal: Number(row?.quantity) * Number(row?.rate),
            AssAmt: Number(row?.quantity) * Number(row?.rate),
            GstRt:
              invoiceData?.companyDetails?.customer?.stateName ==
              invoiceData?.companyDetails?.organizationBranch?.stateName
                ? Number(invoiceData?.rateDetails?.cgstRate) +
                  Number(invoiceData?.rateDetails?.sgstRate)
                : invoiceData?.rateDetails?.igstRate,
            // IgstAmt: invoiceData?.companyDetails?.organizationBranch?.stateId == invoiceData?.companyDetails?.customerBranch?.stateId ? 0 : Number(igstAmt.toFixed(2)),
            IgstAmt:
              invoiceData?.companyDetails?.customer?.stateName ==
              invoiceData?.companyDetails?.organizationBranch?.stateName
                ? 0
                : Number(igstAmt.toFixed(2)),
            // CgstAmt: invoiceData?.companyDetails?.organizationBranch?.stateId == invoiceData?.companyDetails?.customerBranch?.stateId ? Number(gstAmt.toFixed(2)) : 0,
            CgstAmt:
              invoiceData?.companyDetails?.customer?.stateName ==
              invoiceData?.companyDetails?.organizationBranch?.stateName
                ? Number(cgstAmt.toFixed(2))
                : 0,
            // SgstAmt: invoiceData?.companyDetails?.organizationBranch?.stateId == invoiceData?.companyDetails?.customerBranch?.stateId ? Number(gstAmt.toFixed(2)) : 0,
            SgstAmt:
              invoiceData?.companyDetails?.customer?.stateName ==
              invoiceData?.companyDetails?.organizationBranch?.stateName
                ? Number(sgstAmt.toFixed(2))
                : 0,
            CesRt: 0, // Need Clarity
            CesAmt: 0, // Need Clarity
            CesNonAdvlAmt: 0, // Need Clarity
            StateCesRt: 0, // Need Clarity
            StateCesAmt: 0, // Need Clarity
            StateCesNonAdvlAmt: 0, // Need Clarity
            OthChrg: 0,
            TotItemVal: Number(totItemVal.toFixed(2)),
            OrdLineRef: "0",
            OrgCntry: "IN",
            PrdSlNo: "0",
            AttribDtls: [
              {
                Nm: row?.serviceName,
                Val: totItemVal.toFixed(2),
              },
            ],
          };
        }
      ),

      ValDtls: {
        AssVal: Number(invoiceData?.rateDetails?.amount),
        // CgstVal: invoiceData?.companyDetails?.organizationBranch?.stateId == invoiceData?.companyDetails?.customerBranch?.stateId ? Number(invoiceData?.rateDetails?.taxableAmount)/2 : 0,
        CgstVal:
          invoiceData?.companyDetails?.customer?.stateName ==
          invoiceData?.companyDetails?.organizationBranch?.stateName
            ? Number(invoiceData?.rateDetails?.taxableAmount) / 2
            : 0,
        // SgstVal: invoiceData?.companyDetails?.organizationBranch?.stateId == invoiceData?.companyDetails?.customerBranch?.stateId ? Number(invoiceData?.rateDetails?.taxableAmount)/2 : 0,
        SgstVal:
          invoiceData?.companyDetails?.customer?.stateName ==
          invoiceData?.companyDetails?.organizationBranch?.stateName
            ? Number(invoiceData?.rateDetails?.taxableAmount) / 2
            : 0,
        // IgstVal: invoiceData?.companyDetails?.organizationBranch?.stateId == invoiceData?.companyDetails?.customerBranch?.stateId ? 0 : Number(invoiceData?.rateDetails?.taxableAmount),
        IgstVal:
          invoiceData?.companyDetails?.customer?.stateName ==
          invoiceData?.companyDetails?.organizationBranch?.stateName
            ? 0
            : Number(invoiceData?.rateDetails?.taxableAmount),
        CesVal: 0, // Need clarity
        StCesVal: 0, // Need clarity
        Discount: 0,
        OthChrg: 0,
        RndOffAmt: Number(
          (
            Math.ceil(Number(invoiceData?.rateDetails?.taxableAmount)) -
            Number(invoiceData?.rateDetails?.taxableAmount)
          ).toFixed(2)
        ),
        TotInvVal: Number(invoiceData?.rateDetails?.totalAmount),
        TotInvValFc: 0, // Need clarity
      },
    };
    return data;
  }

  onGenerateIRNClick() {
    // console.log(this.generateIRNData(this.getInvoiceData()));
    this.generateIRN(this.generateIRNData(this.getInvoiceData()));
    // this.generateCountdown(row?.ackDate).then((data) => {
    //   return data
    // });
  }

  onCancelIRNClick() {
    const payload = {
      cancelRem: "Wrong entry",
      cancelReason: "1",
      irn: this.invoiceData?.irn,
      gstIn: this.invoiceData?.companyDetails?.organization?.gstin,
    };
    this.cancelIRN(payload);
  }

  generateCountdown(time) {
    // Set the date and time to countdown from

    const date = moment(time).add(24, "hours").toDate();
    date.setHours(date.getHours() - 5);
    date.setMinutes(date.getMinutes() - 30);
    date.getTime();
    const countdownDate = date.getTime();

    // Update the countdown every second
    const countdownTimer = setInterval(function () {
      // Get the current date and time
      const now = new Date().getTime();

      // Calculate the time remaining
      const timeRemaining = countdownDate - now;

      // Calculate the hours, minutes, and seconds remaining
      const hours = Math.floor(
        (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      // Display the time remaining
      console.log(timeRemaining);

      if (timeRemaining > 0) {
        this.setCancelDisabled = false;
      } else {
        clearInterval(countdownTimer);
        this.setCancelDisabled = true;
      }

      // If the countdown is finished, clear the timer
    }, 1000); // update every second
  }

  calculateGst() {
    console.log(this.invoiceFinalData, this.invoiceData);
    let organizationStateName = this.invoiceFinalData.companyDetails
      .organization.stateName
      ? this.invoiceFinalData.companyDetails.organization.stateName
      : this.invoiceData.companyDetails.organization.stateName;
    let customerStateName = this.invoiceFinalData.companyDetails.customer
      .stateName
      ? this.invoiceFinalData.companyDetails.customer.stateName
      : this.invoiceData.companyDetails.customer.stateName;

    if (customerStateName == organizationStateName) {
      this.rateDetailsModel.cgstRate =
        this.invoiceFinalData.rateDetails.cgstRate = 9;
      this.rateDetailsModel.sgstRate =
        this.invoiceFinalData.rateDetails.sgstRate = 9;
      this.rateDetailsModel.igstRate =
        this.invoiceFinalData.rateDetails.igstRate = "";
    } else {
      this.rateDetailsModel.cgstRate =
        this.invoiceFinalData.rateDetails.cgstRate = "";
      this.rateDetailsModel.sgstRate =
        this.invoiceFinalData.rateDetails.sgstRate = "";
      this.rateDetailsModel.igstRate =
        this.invoiceFinalData.rateDetails.igstRate = 18;
    }
  }

  // API Call
  getAllOrganization() {
    this.invoiceGenerationService.getAllOrganization().subscribe((res: any) => {
      this.companyDetailConfig.organizationConfig.options = res;
      if (res) {
        this.invoiceFinalData.companyDetails.organization.name = res[0]?.name;
        this.invoiceFinalData.companyDetails.organization.emailId =
          res[0]?.emailId;
        this.invoiceFinalData.companyDetails.organization.pancardNo =
          res[0]?.panNo;
        this.invoiceFinalData.companyDetails.organization.cinNo = res[0]?.cinNo;
        this.companyDetailsModel.companyCode = res[0]?.companyCode;
      }
      // Set First Value
      if (
        this.companyDetailConfig.organizationConfig.options?.length > 0 &&
        this.invoiceDrawerType == "add"
      ) {
        this.companyDetailsModel.organizationId =
          this.companyDetailConfig.organizationConfig.options[0]!.id;
      }
    });
  }
  getAllBranchByOrgId() {
    this.invoiceGenerationService
      .getAllBranchByOrgId(this.companyDetailsModel.organizationId)
      .subscribe((res: any) => {
        this.companyDetailConfig.branchSelectorConfig.options = res
          .filter(
            (item: any) =>
              item.organizationId === this.companyDetailsModel.organizationId
          )
          .map((row: any) => {
            row["organizationBranchId"] = row.id;
            return {
              ...row,
            };
          });

        // Set First Value
        if (
          this.companyDetailConfig.branchSelectorConfig.options?.length > 0 &&
          this.invoiceDrawerType == "add"
        ) {
          this.companyDetailsModel.organizationBranchId =
            this.companyDetailConfig.branchSelectorConfig.options[0]!.id;
          this.invoiceFinalData.companyDetails.organization.address =
            this.companyDetailConfig.branchSelectorConfig.options[0]?.address;
          this.invoiceFinalData.companyDetails.organization.gstin =
            this.companyDetailConfig.branchSelectorConfig.options[0]?.gstin;
          this.invoiceFinalData.companyDetails.organization.stateName =
            this.companyDetailConfig.branchSelectorConfig.options[0]?.stateName;
          this.invoiceFinalData.companyDetails.organization.stateTinCode =
            this.companyDetailConfig.branchSelectorConfig.options[0]?.stateTinCode;
          this.companyDetailsModel.cityCode =
            this.companyDetailConfig.branchSelectorConfig.options[0]?.cityCode; //cityCode
        }

        // if (
        //   this.invoiceFinalData.companyDetails.customer.stateName ==
        //   this.invoiceFinalData?.companyDetails?.organizationBranch?.stateName
        // ) {
        //   this.rateDetailsModel.cgstRate =
        //     this.invoiceFinalData.rateDetails.cgstRate = 9;
        //   this.rateDetailsModel.sgstRate =
        //     this.invoiceFinalData.rateDetails.sgstRate = 9;
        //   this.rateDetailsModel.igstRate =
        //     this.invoiceFinalData.rateDetails.igstRate = "";
        // }
        this.calculateGst();
      });
  }
  // Customer
  getAllCustomer() {
    this.invoiceGenerationService.getAllCustomer().subscribe((res: any) => {
      this.companyDetailConfig.customerSelectorConfig.options = res.map(
        (row: any) => {
          row["customerId"] = row.id;
          return {
            ...row,
          };
        }
      );
      // Set First Value
      if (
        this.companyDetailConfig.customerSelectorConfig.options?.length > 0 &&
        this.invoiceDrawerType == "add"
      ) {
        this.companyDetailsModel.customerId =
          this.companyDetailConfig.customerSelectorConfig.options[0]!.id;
        this.invoiceFinalData.companyDetails.customer.name = res[0]?.name;
      }
    });
  }
  getAllBranchByCustomerId() {
    // console.log(this.companyDetailsModel);
    this.invoiceGenerationService
      .getAllBranchByCustomerId(this.companyDetailsModel.customerId)
      .subscribe((res: any) => {
        this.companyDetailConfig.customerBranchSelectorConfig.options = res
          .filter(
            (item: any) =>
              item.customerId === this.companyDetailsModel.customerId
          )
          .map((row: any) => {
            row["customerBranchId"] = row.id;
            return {
              ...row,
            };
          });
        // Set First Value
        if (
          this.companyDetailConfig.customerBranchSelectorConfig.options
            ?.length > 0 &&
          this.invoiceDrawerType == "add"
        ) {
          this.companyDetailsModel.customerBranchId =
            this.companyDetailConfig.customerBranchSelectorConfig.options[0]!.id;
          this.invoiceFinalData.companyDetails.customer.address =
            this.companyDetailConfig.customerBranchSelectorConfig.options[0]?.address;
          this.invoiceFinalData.companyDetails.customer.address2 =
            this.companyDetailConfig.customerBranchSelectorConfig.options[0]?.address2;
          this.invoiceFinalData.companyDetails.customer.gstin =
            this.companyDetailConfig.customerBranchSelectorConfig.options[0]?.gstin;
          this.invoiceFinalData.companyDetails.customer.stateName =
            this.companyDetailConfig.customerBranchSelectorConfig.options[0]?.stateName;
          this.invoiceFinalData.companyDetails.customer.stateTinCode =
            this.companyDetailConfig.customerBranchSelectorConfig.options[0]?.stateTinCode;
          console.log(this.invoiceFinalData.companyDetails.customer.stateName);
        }
        this.calculateGst();
        // if (
        //   this.invoiceFinalData.companyDetails.customer.stateName ==
        //   this.invoiceFinalData?.companyDetails?.organizationBranch?.stateName
        // ) {
        //   this.rateDetailsModel.cgstRate =
        //     this.invoiceFinalData.rateDetails.cgstRate = 9;
        //   this.rateDetailsModel.sgstRate =
        //     this.invoiceFinalData.rateDetails.sgstRate = 9;
        //   this.rateDetailsModel.igstRate =
        //     this.invoiceFinalData.rateDetails.igstRate = "";
        // }
      });
  }

  // Cargo Details
  getAllCargoTypes() {
    this.invoiceGenerationService.getAllCargoTypes().subscribe((res: any) => {
      this.shipmentDetailConfig.cargoTypeConfig.options = res.map(
        (row: any) => {
          row["cargoTypeId"] = row.id;
          return {
            ...row,
          };
        }
      );
      // Set First Value
      if (
        this.shipmentDetailConfig.cargoTypeConfig.options?.length > 0 &&
        this.invoiceDrawerType == "add"
      ) {
        this.shipmentDetailsModel.cargoTypeId =
          this.shipmentDetailConfig.cargoTypeConfig.options[0]!.id;
        this.invoiceFinalData.shipmentDetails.cargoTypeName =
          this.shipmentDetailConfig.cargoTypeConfig.options[0]!.name;
      }
    });
  }

  // Airline Details
  getAllAirlines() {
    this.invoiceGenerationService.getAllAirlines().subscribe((res: any) => {
      if (res.data) {
        this.airlineData = res.data;
      }
    });
  }

  // Service Type
  getAllServiceType() {
    this.invoiceGenerationService.getAllServiceType().subscribe((res: any) => {
      this.serviceTypeData = res.map((row: any) => {
        row["serviceTypeId"] = row.id;
        return {
          ...row,
        };
      });
      if (!this.invoiceData?.invoiceItems) {
        this.lineItemFormConfigList[0].serviceTypeConfig.options =
          this.serviceTypeData;
      } else {
        if (this.invoiceDrawerType != "view") {
          const lineItems = JSON.parse(this.invoiceData?.invoiceItems);
          lineItems.forEach((element) => {
            if (element && element.quantity) {
              this.loadLineItems(element);
            }
          });
        }
      }

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
        this.invoiceFinalData.bankDetails = this.bankDetailsModel;
      });
  }

  // Consigement Details

  getAllShippers() {
    this.invoiceGenerationService.getAllShippers().subscribe((res: any) => {
      if (res.data) {
        this.consignmentDetailConfig.shipper.options = res.data.map(
          (row: any) => {
            row["shipperId"] = row.id;
            return {
              ...row,
            };
          }
        );
      }
    });
  }

  getAllConsignees() {
    this.invoiceGenerationService.getAllConsignees().subscribe((res: any) => {
      if (res.data) {
        this.consignmentDetailConfig.consignee.options = res.data.map(
          (row: any) => {
            row["consigneeId"] = row.id;
            return {
              ...row,
            };
          }
        );
      }
    });
  }

  getAllPorts() {
    this.invoiceGenerationService.getAllPorts().subscribe((res: any) => {
      if (res.data) {
        this.portData = res.data;
        this.consignmentDetailConfig.loadingPort.options = res.data
          .filter((item: any) => item.isLoadingPort == 1)
          .map((row: any) => {
            row["loadingPortId"] = row.id;
            row["destinationPortId"] = row.id;
            return {
              ...row,
            };
          });
        if (this.invoiceData) {
          if (this.portData) {
            this.consignmentDetailConfig.destinationPort.options =
              this.portData?.filter(
                (item: any) =>
                  item.isLoadingPort != 1 &&
                  item.countryId ==
                    this.invoiceData?.shipmentDetails?.portCountryId
              );
          }
          const portData = this.portData?.find(
            (item: any) =>
              item?.portCode == this.invoiceData?.shipmentDetails?.portCode
          );
          console.log(portData, this.invoiceData?.shipmentDetails?.portCode);

          this.invoiceFinalData.shipmentDetails.placeOfSupply = portData
            ? portData?.placeOfSupply
            : "";
        }
        this.consignmentDetailConfig.dischargePort.options = res.data;
      }
    });
  }

  getAllUnitData() {
    this.invoiceGenerationService.getAllUnitData().subscribe((res: any) => {
      if (res.data) {
        this.rateDetailsConfig.unitConfig.options = res.data.map((row: any) => {
          row["unitId"] = row.id;
          return {
            ...row,
          };
        });
      }
    });
  }

  getAllCountryData() {
    this.invoiceGenerationService
      .getAllCountriesData()
      .subscribe((res: any) => {
        if (res.data) {
          this.consignmentDetailConfig.destinationPortCountry.options =
            res.data.map((row: any) => {
              row["countryId"] = row.id;
              return {
                ...row,
              };
            });
        }
      });
  }

  generateIRN(payload) {
    this.invoiceGenerationService.generateIRN(payload).subscribe((res: any) => {
      console.log(res);
      if (res?.success) {
        this.invoiceData.irn = res?.data?.outcome?.Irn;
        this.invoiceData.ackDate = res?.data?.outcome?.AckDt;
        this.invoiceData.ackNo = res?.data?.outcome?.AckNo;
        this.invoiceData.qrCode =
          "data:image/png;base64," + res?.data?.outcome?.QrImage;
        this.invoiceData.bankDetails = {
          id: 1,
          organizationId: 1,
          name: "AXIS BANK LTD",
          branchName: "Mahim",
          ifscCode: "UTIB0001243",
          accountNumber: "920020018286808",
          swiftCode: "UTIB0001243",
        };
        this.invoiceData.companyDetails.organization.id =
          this.companyDetailsModel.organizationId;
        this.invoiceData.companyDetails.customer.customerId =
          this.companyDetailsModel.customerId;
        this.invoiceData.isIrnGenerated = 1;
        let data = this.generatePostData();
        data.rateDetails.invoiceItems = this.lineItems;
        this.addUpdateInvoice(data);
        // this.onBtnClick.emit("done");
      } else {
        this.toasty.error(res?.error?.message);
        this.onBtnClick.emit("done");
      }
    });
  }

  cancelIRN(payload) {
    this.invoiceGenerationService.cancelIRN(payload).subscribe((res: any) => {
      if (res?.success) {
        this.updateCancelIRNInvoice(this.invoiceData?.id);
      } else {
        this.toasty.error(res?.error?.message);
        this.onBtnClick.emit("done");
      }
    });
  }

  updateCancelIRNInvoice(id) {
    this.invoiceGenerationService
      .updateCancelIRNInvoice(id)
      .subscribe((res: any) => {
        this.toasty.success(res.message);
        this.onBtnClick.emit("done");
      });
  }
}
