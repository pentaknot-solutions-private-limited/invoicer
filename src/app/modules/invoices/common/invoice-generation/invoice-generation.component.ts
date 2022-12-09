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
  invoiceFinalData: any = {};
  portData: any;
  srcdata: any;
  showPDFTemplate: boolean = false;

  constructor(
    private invoiceGenerationService: InvoiceGenerationService,
    private toasty: VSAToastyService,
    private filterService: FilterService,
    private fb: FormBuilder
  ) {
    this.getAllPorts();
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

    this.getAllUnitData();
    // Set Initial Values
    this.setInitValues();
    this.lineItemForm = this.fb.group({
      lineItemList: this.fb.array([], minLengthArray(1)),
    });
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

  getControl(lineItem: FormGroup, controlName: string) {
    return lineItem.get(controlName) as FormControl;
  }

  createLineItemForm() {
    return this.fb.group({
      serviceTypeId: [""],
      serviceName: [""],
      hsnCode: [""],
      packageQty: new FormControl(""),
      chargeableWt: new FormControl(""),
      quantity: [""],
      unitId: [""],
      unit: [""],
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
    setTimeout(() => {
      this.getAllBranchByOrgId();
      this.getAllBranchByCustomerId();
    }, 500);
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
      this.shipmentDetailsModel.consigneeId =
        this.invoiceData?.shipmentDetails?.consigneeId;
      this.shipmentDetailsModel.awbNo =
        this.invoiceData?.shipmentDetails?.awbNo;
      this.shipmentDetailsModel.flightNo =
        this.invoiceData?.shipmentDetails?.flightNo;
      this.shipmentDetailsModel.departureDate =
        this.invoiceData?.shipmentDetails?.departureDate;
      this.shipmentDetailsModel.loadingPortId =
        this.invoiceData?.shipmentDetails?.loadingPortId;
      this.shipmentDetailsModel.destinationPortId =
        this.invoiceData?.shipmentDetails?.destinationPortId;
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

      // Basic Details
      this.basicDetailsModel.invoiceDate = this.invoiceData?.invoiceDate;
      this.basicDetailsModel.invoiceDueDate = this.invoiceData?.invoiceDueDate;
      this.basicDetailsModel.invoiceNo =
        this.invoiceData?.isCompleted == 1 ? this.invoiceData?.invoiceNo : "-";

      // Rate Details
      this.rateDetailsModel.amount = Number(
        this.invoiceData?.rateDetails?.amount
      );
      this.rateDetailsModel.amountInWords =
        this.invoiceData?.rateDetails?.amountInWords;
      this.rateDetailsModel.igstRate = Number(
        this.invoiceData?.rateDetails?.igstRate
      );
      this.rateDetailsModel.taxableAmount = Number(
        this.invoiceData?.rateDetails?.taxableAmount
      );
      this.rateDetailsModel.totalAmount = Number(
        this.invoiceData?.rateDetails?.totalAmount
      );

      // Bank Details
      this.bankDetailsModel = this.invoiceData.bankDetails;
      if (this.invoiceDrawerType == 'view') {
        this.lineItems = JSON.parse(this.invoiceData?.invoiceItems)
        this.generatePDF()
      }
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

  get setNextButtonDisabled() {
    if (
      this.currentStepIndex == 1 &&
      (!this.shipmentDetailsModel.shipperId ||
        !this.shipmentDetailsModel.consigneeId ||
        !this.shipmentDetailsModel.awbNo ||
        !this.shipmentDetailsModel.flightNo ||
        !this.shipmentDetailsModel.departureDate ||
        !this.shipmentDetailsModel.loadingPortId ||
        !this.shipmentDetailsModel.destinationPortId ||
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
      (!this.lineItems[0].quantity || !this.lineItems[0].rate)
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

  loadLineItems(lineItems) {
    console.log(this.serviceTypeData);

    this.lineItemListForm = this.lineItemForm.get("lineItemList") as FormArray;
    const formIndex =
      this.lineItemFormConfigList.push(_.cloneDeep(this.lineItemFormConfig)) -
      1;
    this.lineItemFormConfigList[formIndex].serviceTypeConfig.options =
      this.getServiceTypeData(true, lineItems?.serviceId);

    this.lineItemListForm.push(this.createLineItemForm());
    this.lineItems.push(lineItems);
    this.lineItemForm.get("lineItemList")["controls"][formIndex].patchValue({
      serviceTypeId: lineItems.serviceId,
      hsnCode: lineItems.serviceId,
      serviceName: lineItems.serviceName,
      unitId: lineItems.unitId,
      unit: lineItems.unit,
    });
    this.lineItemFormConfigList[
      formIndex
    ].serviceTypeConfig.attributes.hint = `HSN Code: ${lineItems?.hsnCode}`;
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
    console.log();
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
        data.isCompleted = 1;
        console.log(data);
        this.addUpdateInvoice(data);
        break;
      case "draft":
        data = this.generatePostData();
        data.isCompleted = 0;
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

        break;
      case "destinationPort":
        this.invoiceFinalData.shipmentDetails.portCode =
          event?.selectedObj?.portCode;

        break;
      case "serviceType":
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

  getInvoiceData() {
    if (this.invoiceData) {
      this.invoiceFinalData.companyDetails = this.invoiceData?.companyDetails;
    }
    this.invoiceFinalData.shipmentDetails.dispatchDocNo =
      this.shipmentDetailsModel?.dispatchDocNo;
    this.invoiceFinalData.shipmentDetails.awbNo =
      this.shipmentDetailsModel?.awbNo;
    this.invoiceFinalData.shipmentDetails.flightNo =
      this.shipmentDetailsModel?.flightNo;
    this.invoiceFinalData.shipmentDetails.departureDate =
      this.shipmentDetailsModel?.departureDate;
    this.invoiceFinalData.shipmentDetails.packageQty =
      this.shipmentDetailsModel?.packageQty;
    this.invoiceFinalData.rateDetails.invoiceItems =
      this.lineItems.filter((row: any) => row.rate) ||
      this.lineItemForm?.get("lineItemList")?.value;
    this.invoiceFinalData.rateDetails.amount = this.rateDetailsModel?.amount;
    this.invoiceFinalData.rateDetails.igstRate = Number(
      this.rateDetailsModel?.igstRate.toString().split("%")[0]
    );
    this.invoiceFinalData.invoiceDate = this.basicDetailsModel.invoiceDate;
    this.invoiceFinalData.rateDetails.taxableAmount =
      this.rateDetailsModel?.taxableAmount;
    this.invoiceFinalData.rateDetails.totalAmount =
      this.rateDetailsModel?.totalAmount;
    this.invoiceFinalData.rateDetails.amountInWords =
      this.rateDetailsModel?.amountInWords;
    const groupedData = _(
      this.lineItems.filter((row: any) => row.rate) ||
        this.lineItemForm?.get("lineItemList")?.value
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
    console.log(this.invoiceFinalData);

    return this.invoiceFinalData;
  }

  generatePostData() {
    return {
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
        invoiceItems: this.invoiceData?.invoiceItems
          ? JSON.parse(this.invoiceData?.invoiceItems)
          : this.lineItems,
        amount: Number(this.rateDetailsModel?.amount),
        cgstRate: 0,
        sgstRate: 0,
        igstRate: Number(this.rateDetailsModel?.igstRate.toString().split("%")[0]),
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
      invoiceNo: this.invoiceData?.invoiceNo ? this.invoiceData?.invoiceNo : "",
      invoiceDate: this.basicDetailsModel?.invoiceDate,
      invoiceDueDate: this.basicDetailsModel?.invoiceDueDate,
    };
  }

  // API Call
  getAllOrganization() {
    this.invoiceGenerationService.getAllOrganization().subscribe((res: any) => {
      this.companyDetailConfig.organizationConfig.options = res;
      if (res) {
        this.invoiceFinalData.companyDetails.organization.name = res[0]?.name;
        this.invoiceFinalData.companyDetails.organization.emailId =
          res[0]?.emailId;
      }
      // Set First Value
      if (this.companyDetailConfig.organizationConfig.options?.length > 0) {
        this.companyDetailsModel.organizationId =
          this.companyDetailConfig.organizationConfig.options[0]!.id;
        this.companyDetailsModel.companyCode = res[0]?.companyCode;
        console.log(this.companyDetailsModel.companyCode);
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
        this.invoiceFinalData.companyDetails.organization.address =
          res[0]?.address;
        this.invoiceFinalData.companyDetails.organization.gstin = res[0]?.gstin;
        this.invoiceFinalData.companyDetails.organization.stateName =
          res[0]?.stateName;
        this.invoiceFinalData.companyDetails.organization.stateTinCode =
          res[0]?.stateTinCode;
        // Set First Value
        if (this.companyDetailConfig.branchSelectorConfig.options?.length > 0) {
          this.companyDetailsModel.organizationBranchId =
            this.companyDetailConfig.branchSelectorConfig.options[0]!.id;
          this.companyDetailsModel.cityCode = res[0].cityCode; //cityCode
          console.log(this.companyDetailsModel.cityCode);
        }
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
      if (this.companyDetailConfig.customerSelectorConfig.options?.length > 0) {
        this.companyDetailsModel.customerId =
          this.companyDetailConfig.customerSelectorConfig.options[0]!.id;
      }
      this.invoiceFinalData.companyDetails.customer.name = res[0]?.name;
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
            ?.length > 0
        ) {
          this.companyDetailsModel.customerBranchId =
            this.companyDetailConfig.customerBranchSelectorConfig.options[0]!.id;
        }
        this.invoiceFinalData.companyDetails.customer.address =
          res[0]?.address + ", " + res[0]?.address2;
        this.invoiceFinalData.companyDetails.customer.gstin = res[0]?.gstin;
        this.invoiceFinalData.companyDetails.customer.stateName =
          res[0]?.stateName;
        this.invoiceFinalData.companyDetails.customer.stateTinCode =
          res[0]?.stateTinCode;
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
      this.serviceTypeData = res.map((row: any) => {
        row["serviceId"] = row.id;
        return {
          ...row,
        };
      });
      if (!this.invoiceData?.invoiceItems) {
        this.lineItemFormConfigList[0].serviceTypeConfig.options =
          this.serviceTypeData;
      } else {
        const lineItems = JSON.parse(this.invoiceData?.invoiceItems);
        lineItems.forEach((element) => {
          if (element && element.quantity) {
            this.loadLineItems(element);
          }
        });
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
        console.log(this.bankDetailsModel);
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
