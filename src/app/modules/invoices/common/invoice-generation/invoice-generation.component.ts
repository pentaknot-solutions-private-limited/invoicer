import {
  AfterViewInit,
  Component,
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
  RateDetails,
  ShipmentDetails,
} from "./invoice-generation.model";

@Component({
  selector: "invoice-generation",
  templateUrl: "./invoice-generation.component.html",
  styleUrls: ["./invoice-generation.component.scss"],
})
export class InvoiceGenerationComponent implements OnInit, AfterViewInit {
  @Input() invoiceData: any;
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

  // Configs
  baseConfig = new InvoicesConfigs();
  stepperConfig: IPMRStepperConfig = {
    steps: [
      {
        stepLabel: "Company Details",
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
    shipper: this.baseConfig.shipperInput,
    consignee: this.baseConfig.consigneeInput,
    placeOfReciept: this.baseConfig.placeOfRecieptInput,
    placeOfDelivery: this.baseConfig.placeOfDeliveryInput,
    loadingPort: this.baseConfig.loadingPortInput,
    dischargePort: this.baseConfig.dischargePortInput,
    destinationPort: this.baseConfig.destinatonPortInput,
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

  consignmentDetailsForm: FormGroup = new FormGroup({
    shipper: new FormControl("", Validators.required),
    consignee: new FormControl("", Validators.required),
    placeOfReciept: new FormControl("", Validators.required),
    loadingPort: new FormControl("", Validators.required),
    dischargePort: new FormControl("", Validators.required),
    placeOfDelivery: new FormControl("", Validators.required),
    destinationPort: new FormControl("", Validators.required),
  });

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
  disabled: boolean = true;
  editMode: boolean = false;
  downloadLoading: boolean = false;
  invoiceDetails: any; //Temporary
  companyDetailsModel: CompanyDetails = new CompanyDetails();
  shipmentDetailsModel: ShipmentDetails = new ShipmentDetails();
  consignmentDetailsModel: ConsignmentDetails = new ConsignmentDetails();
  rateDetailsModel: RateDetails = new RateDetails();
  bankDetailsModel: BankDetails = new BankDetails();

  constructor(private invoiceGenerationService: InvoiceGenerationService) {
    // Set Initial Values
    this.setInitValues();
  }

  setInitValues() {
    this.rateDetailsModel.cgstRate = "9%"; //0.09;
    this.rateDetailsModel.sgstRate = "9%"; //0.09;
    this.rateDetailsModel.igstRate = "-";
  }

  ngOnInit(): void {
    this.getAllOrganization();
    this.getAllCustomer();
    this.getMyAccountDetails();
    setTimeout(() => {
      this.getAllBranchByOrgId();
      this.getAllBranchByCustomerId();
    }, 500);
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
    console.log(this.stepper);
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

      default:
        this.onBtnClick.emit("close");
        break;
    }
  }

  selectionChanged(type: any) {
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
    console.log();
    console.log(this.rateDetailsModel.cgstRate, this.rateDetailsModel.sgstRate);

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
          Number(this.rateDetailsModel.amount) *
          Number(cgstRateValue + sgstRateValue);

        // Update Total Amount
        this.rateDetailsModel.totalAmount =
          Number(this.rateDetailsModel.amount) +
          Number(this.rateDetailsModel.taxableAmount);

        // Update Amount in Words
        this.rateDetailsModel.amountInWords = convertAmountToWords(
          Number(this.rateDetailsModel.totalAmount)
        );
        break;

      default:
        break;
    }
  }

  // API Call
  getAllOrganization() {
    this.invoiceGenerationService.getAllOrganization().subscribe((res: any) => {
      this.companyDetailConfig.organizationConfig.options = res;
      // Set First Value
      if (this.companyDetailConfig.organizationConfig.options?.length > 0) {
        this.companyDetailsModel.organizationId =
          this.companyDetailConfig.organizationConfig.options[0]!.organizationId;
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
          this.companyDetailsModel.branchId =
            this.companyDetailConfig.branchSelectorConfig.options[0]!.branchId;
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
          this.companyDetailConfig.customerSelectorConfig.options[0]!.customerId;
      }
    });
  }
  getAllBranchByCustomerId() {
    console.log(this.companyDetailsModel);
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
            this.companyDetailConfig.customerBranchSelectorConfig.options[0]!.customerBranchId;
        }
      });
  }

  // Bank Details
  getMyAccountDetails() {
    this.invoiceGenerationService
      .getMyAccountDetails()
      .subscribe((res: any) => {
        this.bankDetailsModel = res;
      });
  }
}
