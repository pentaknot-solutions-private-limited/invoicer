import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { InvoicesConfigs } from "src/app/configs/plugin-components/invoices.config";
import { PMRStepperComponent } from "src/app/shared/components/pmr-stepper/pmr-stepper.component";
import { IPMRStepperConfig } from "src/app/shared/components/pmr-stepper/pmr-stepper.model";
import { VSAGridComponent } from "src/app/shared/components/vsa-grid/vsa-grid.component";
import { convertAmountToWords } from "src/app/shared/utils/convert-amount-to-words";
import { InvoiceGenerationService } from "src/app/shared/_http/invoice-generation.service";
import {
  BankDetails,
  CompanyDetails,
  ConsignmentDetails,
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
import { Country, State, City } from "country-state-city";
import { FilterService } from "primeng/api";
import { AutoComplete } from "primeng/autocomplete";

@Component({
  selector: "invoice-generation",
  templateUrl: "./invoice-generation.component.html",
  styleUrls: ["./invoice-generation.component.scss"],
})
export class InvoiceGenerationComponent implements OnInit, AfterViewInit {
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
      { stepLabel: "Consignment Details", stepTemplate: null },
      { stepLabel: "Rates", stepTemplate: null },
      { stepLabel: "Bank Details", stepTemplate: null },
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
    mawbNo: this.baseConfig.mawbNoInput,
    hawbNo: this.baseConfig.hawbNoInput,
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
    arrivalDate: this.baseConfig.arrivalDateInput,
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
    invoiceNo: new FormControl("", Validators.required),
    invoiceDate: new FormControl("", Validators.required),
    invoiceDueDate: new FormControl("", Validators.required),
    //
    mawbNo: new FormControl("", Validators.required),
    hawbNo: new FormControl("", Validators.required),
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
    arrivalDate: new FormControl("", Validators.required),
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

  constructor(
    private invoiceGenerationService: InvoiceGenerationService,
    private toasty: VSAToastyService,
    private filterService: FilterService
  ) {
    // Set Initial Values
    this.setInitValues();
  }

  setInitValues() {
    this.rateDetailsModel.cgstRate = "9%"; //0.09;
    this.rateDetailsModel.sgstRate = "9%"; //0.09;
    this.rateDetailsModel.igstRate = "";
  }

  ngOnInit(): void {
    this.getAllOrganization();
    this.getAllCustomer();
    this.getMyAccountDetails();
    this.getAllCargoTypes();
    this.getAllAirlines();
    this.getAllCurrency();
    this.getAllServiceType();
    this.getAllShippers();
    this.getAllConsignees();
    this.getAllPorts();
    setTimeout(() => {
      this.getAllBranchByOrgId();
      this.getAllBranchByCustomerId();
    }, 500);
    this.consignmentDetailConfig.recieptCountry.options =
      this.consignmentDetailConfig.deliveryCountry.options =
        Country.getAllCountries();
  }

  ngOnChanges() {
    if (this.invoiceDrawerType == 'view') {
      this.companyDetailConfig.branchSelectorConfig.attributes.disable = true
      this.companyDetailConfig.customerBranchSelectorConfig.attributes.disable = true
      this.companyDetailConfig.customerSelectorConfig.attributes.disable = true
      this.companyDetailConfig.invoiceDateInputConfig.attributes.disable = true
      this.companyDetailConfig.invoiceDueDateInputConfig.attributes.disable = true
      this.companyDetailConfig.invoiceNoGenerationInputConfig.attributes.disable = true
      this.companyDetailConfig.organizationConfig.attributes.disable = true

      this.shipmentDetailConfig.airlineConfig.attributes.disable = true
      this.shipmentDetailConfig.arrivalDate.attributes.disable = true
      this.shipmentDetailConfig.cargoTypeConfig.attributes.disable = true
      this.shipmentDetailConfig.chargeableWt.attributes.disable = true
      this.shipmentDetailConfig.date1.attributes.disable = true
      this.shipmentDetailConfig.date2.attributes.disable = true
      this.shipmentDetailConfig.flightNo.attributes.disable = true
      this.shipmentDetailConfig.grossWt.attributes.disable = true
      this.shipmentDetailConfig.hawbNo.attributes.disable = true
      this.shipmentDetailConfig.incoTerms.attributes.disable = true
      this.shipmentDetailConfig.mawbNo.attributes.disable = true
      this.shipmentDetailConfig.netWt.attributes.disable = true
      this.shipmentDetailConfig.packageQty.attributes.disable = true
      this.shipmentDetailConfig.sbNo.attributes.disable = true
      this.shipmentDetailConfig.shipperRef.attributes.disable = true
      this.shipmentDetailConfig.volume.attributes.disable = true

      this.consignmentDetailConfig.consignee.attributes.disable = true
      this.consignmentDetailConfig.deliveryCity.attributes.disable = true
      this.consignmentDetailConfig.deliveryCountry.attributes.disable = true
      this.consignmentDetailConfig.deliveryState.attributes.disable = true
      this.consignmentDetailConfig.destinationPort.attributes.disable = true
      this.consignmentDetailConfig.dischargePort.attributes.disable = true
      this.consignmentDetailConfig.loadingPort.attributes.disable = true
      this.consignmentDetailConfig.recieptCity.attributes.disable = true
      this.consignmentDetailConfig.recieptCountry.attributes.disable = true
      this.consignmentDetailConfig.recieptState.attributes.disable = true
      this.consignmentDetailConfig.shipper.attributes.disable = true

      this.rateDetailsConfig.amount.attributes.disable = true
      this.rateDetailsConfig.amountInWords.attributes.disable = true
      this.rateDetailsConfig.cgstRate.attributes.disable = true
      this.rateDetailsConfig.currencyConfig.attributes.disable = true
      this.rateDetailsConfig.hsnCode.attributes.disable = true
      this.rateDetailsConfig.igstRate.attributes.disable = true
      this.rateDetailsConfig.quantity.attributes.disable = true
      this.rateDetailsConfig.rate.attributes.disable = true
      this.rateDetailsConfig.serviceTypeConfig.attributes.disable = true
      this.rateDetailsConfig.sgstRate.attributes.disable = true
      this.rateDetailsConfig.taxableAmount.attributes.disable = true
      this.rateDetailsConfig.totalAmount.attributes.disable = true
      // consignmentDetailConfigrateDetailsConfig
    }
    if (this.invoiceData) {
      // Set Stepper Config
      this.stepperConfig.steps.map((row: any) => {
        row["isCompleted"] = true
        return {
          ...row
        }
      })
      // Basic Details
      this.companyDetailsModel.customerBranchId = this.invoiceData.companyDetails.customerBranchId;
      this.companyDetailsModel.customerId = this.invoiceData.companyDetails.customer.customerId
      this.companyDetailsModel.invoiceDate = this.invoiceData.invoiceDate
      this.companyDetailsModel.invoiceDueDate = this.invoiceData.dueDate
      this.companyDetailsModel.invoiceNo = this.invoiceData.invoiceNo
      this.companyDetailsModel.organizationBranchId = this.invoiceData.companyDetails.organizationBranchId
      this.companyDetailsModel.organizationId = this.invoiceData.companyDetails.organization.id
      // Shipment Details
      this.shipmentDetailsModel = this.invoiceData.shipmentDetails
      // Consignment Details
      this.consignmentDetailsModel = this.invoiceData.consignmentDetails
      // Rate Details
      this.rateDetailsModel = this.invoiceData.rateDetails
      this.rateDetailsModel.cgstRate = this.invoiceData.rateDetails.cgstRate ? `${this.invoiceData.rateDetails.cgstRate}%` : ""
      this.rateDetailsModel.sgstRate = this.invoiceData.rateDetails.sgstRate ? `${this.invoiceData.rateDetails.sgstRate}%` : ""
      this.rateDetailsModel.igstRate = this.invoiceData.rateDetails.igstRate ? `${this.invoiceData.rateDetails.igstRate}%` : ""
      // Bank Details
      this.bankDetailsModel = this.invoiceData.bankDetails
    }
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
          step.stepTemplate = this.consignmentDetails;
          break;
        case 3:
          step.stepTemplate = this.rates;
          break;
        case 4:
          step.stepTemplate = this.bankDetails;
          break;
        case 5:
          step.stepTemplate = this.preview;
          break;
        default:
          break;
      }
    });
    // console.log(this.stepper);
  }

  // Drawer Action Events
  actionEvent(event) {
    // let eventData = null;
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
        const bankDetails = {
          bankDetailId: this.bankDetailsModel.id,
          bankName: this.bankDetailsModel.name,
          bankIfscCode: this.bankDetailsModel.ifscCode,
          bankAccountNumber: this.bankDetailsModel.accountNumber,
          bankSwiftCode: this.bankDetailsModel.swiftCode,
        };
        this.consignmentDetailsModel.placeOfDeliveryId = 1
        this.consignmentDetailsModel.placeOfRecieptId = 1
        const data = {
          id: this.invoiceData.id ? this.invoiceData.id : null,
          companyDetails: this.companyDetailsModel,
          shipmentDetails: this.shipmentDetailsModel,
          consignmentDetails: this.consignmentDetailsModel,
          rateDetails: this.rateDetailsModel,
          bankDetails: bankDetails,
          invoiceNo: this.companyDetailsModel.invoiceNo,
          invoiceDate: this.companyDetailsModel.invoiceDate,
          dueDate: this.companyDetailsModel.invoiceDueDate,
          shipmentNo: "",
          shipmentTypeId: 0,
          isCompleted: 1
        };

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
        this.consignmentDetailsModel.placeOfDeliveryId = 1
        this.consignmentDetailsModel.placeOfRecieptId = 1
        const editData = {
          id: this.invoiceData.id ? this.invoiceData.id : null,
          companyDetails: this.companyDetailsModel,
          shipmentDetails: this.shipmentDetailsModel,
          consignmentDetails: this.consignmentDetailsModel,
          rateDetails: this.rateDetailsModel,
          bankDetails: editBankDetails,
          invoiceNo: this.companyDetailsModel.invoiceNo,
          invoiceDate: this.companyDetailsModel.invoiceDate,
          dueDate: this.companyDetailsModel.invoiceDueDate,
          shipmentNo: "",
          shipmentTypeId: 0,
          isCompleted: 0
        };

        this.addUpdateInvoice(editData);
        break;

      default:
        this.onBtnClick.emit("close");
        break;
    }
  }

  selectionChanged(type: any) {
    // console.log(type);

    switch (type) {
      case "org":
        this.getAllBranchByOrgId();
        break;
      case "customer":
        this.getAllBranchByCustomerId();
        break;
      default:
        break;
    }
  }

  valueChanged(type: any) {
    switch (type) {
      case "quantity":
      case "rate":
        this.rateDetailsModel.amount =
          Number(this.rateDetailsModel.quantity) *
          Number(this.rateDetailsModel.rate);

        // Update Taxable Amount
        const cgstRateValue =
          Number(this.rateDetailsModel.cgstRate.toString().split("%")[0]) / 100;
        const sgstRateValue =
          Number(this.rateDetailsModel.sgstRate.toString().split("%")[0]) / 100;
        const igstRateValue =
          Number(this.rateDetailsModel.igstRate.toString().split("%")[0]) / 100;
        this.rateDetailsModel.taxableAmount =
          Math.round(
            Number(this.rateDetailsModel.amount) *
              Number(cgstRateValue + sgstRateValue) *
              100
          ) / 100;

        // Update Total Amount
        this.rateDetailsModel.totalAmount = Math.round(
          Number(this.rateDetailsModel.amount) +
            Number(this.rateDetailsModel.taxableAmount)
        );

        // Update Amount in Words
        // const totalAmt = this.rateDetailsModel.totalAmount.toString().split('.')
        // console.log(totalAmt);

        // this.rateDetailsModel.amountInWords = convertAmountToWords(
        //   Number(parseInt(totalAmt[0]))) +"and"+convertAmountToWords(
        //     Number(parseInt(totalAmt[1])));
        this.rateDetailsModel.amountInWords = convertAmountToWords(
          Math.round(Number(this.rateDetailsModel.totalAmount))
        );
        break;

      default:
        break;
    }
  }

  // Download PDF //PDF genrate button click function
  public downloadAsPDF() {
    const isExist = document.getElementsByTagName("div")[0];
    if (isExist) {
      const doc = new jsPDF("p", "pt", "a4");
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
          const filename = new Date().toDateString() + "invoice.pdf";
          doc.save(filename);
        },
      });
    }
  }

  onCountrySelection(type, event) {
    if (type == "reciept") {
      this.consignmentDetailConfig.recieptState.options =
        State.getStatesOfCountry(event.value);
      this.consignmentDetailConfig.recieptState.attributes.disable = false;
    } else {
      this.consignmentDetailConfig.deliveryState.options =
        State.getStatesOfCountry(event.value);
      this.consignmentDetailConfig.deliveryState.attributes.disable = false;
    }
  }

  onStateSelection(type, event) {
    if (type == "reciept") {
      this.consignmentDetailConfig.recieptCity.options = City.getCitiesOfState(
        this.locationModel.recieptCountry,
        event.value
      );
      this.consignmentDetailConfig.recieptCity.attributes.disable = false;
    } else {
      this.consignmentDetailConfig.deliveryCity.options = City.getCitiesOfState(
        this.locationModel.deliveryCountry,
        event.value
      );
      this.consignmentDetailConfig.deliveryCity.attributes.disable = false;
    }
  }

  onCitySelection(type, event) {
    if (type == "reciept") {
      this.consignmentDetailsModel.placeOfRecieptId = `${this.locationModel.recieptCountry}_${this.locationModel.recieptState}_${event.value}`;
    } else {
      this.consignmentDetailsModel.placeOfDeliveryId = `${this.locationModel.deliveryCountry}_${this.locationModel.deliveryState}_${event.value}`;
    }
  }

  // API Call
  getAllOrganization() {
    this.invoiceGenerationService.getAllOrganization().subscribe((res: any) => {
      this.companyDetailConfig.organizationConfig.options = res;
      // Set First Value
      if (this.companyDetailConfig.organizationConfig.options?.length > 0) {
        this.companyDetailsModel.organizationId =
          this.companyDetailConfig.organizationConfig.options[0]!.id;
      }
    });
  }
  getAllBranchByOrgId() {
    this.invoiceGenerationService
      .getAllBranchByOrgId(this.companyDetailsModel.organizationId)
      .subscribe((res: any) => {
        this.companyDetailConfig.branchSelectorConfig.options = res.filter(
          (item: any) => item.organizationId === this.companyDetailsModel.organizationId
        );
        // Set First Value
        if (this.companyDetailConfig.branchSelectorConfig.options?.length > 0) {
          this.companyDetailsModel.organizationBranchId =
            this.companyDetailConfig.branchSelectorConfig.options[0]!.id;
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
      this.rateDetailsConfig.serviceTypeConfig.options = res;
      // Set First Value
      if (this.rateDetailsConfig.serviceTypeConfig.options?.length > 0) {
        this.rateDetailsModel.serviceTypeId =
          this.rateDetailsConfig.serviceTypeConfig.options[0]!.id;
      }
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
        this.consignmentDetailConfig.loadingPort.options = res.data;
        this.consignmentDetailConfig.destinationPort.options = res.data;
        this.consignmentDetailConfig.dischargePort.options = res.data;
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
