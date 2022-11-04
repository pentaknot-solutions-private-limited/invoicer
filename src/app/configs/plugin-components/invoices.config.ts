import * as moment from "moment";
import { IGridConfig } from "src/app/shared/components/vsa-grid/vsa-grid.model";
import { ITextConfig } from "src/app/shared/components/vsa-input/vsa-input.model";
import { ISelectConfig } from "src/app/shared/components/vsa-select-box/vsa-select-box.model";

export class InvoicesConfigs {
  // Search Box
  invoiceNoInput: ITextConfig = {
    fieldKey: "invoiceNo",
    attributes: {
      placeholder: "Search Invoice No",
      title: "Invoice No",
    },
  };
  billToCustomerInput: ITextConfig = {
    fieldKey: "billTo",
    attributes: {
      placeholder: "Search Customer Name",
      title: "Customer Name",
    },
  };
  ewayNoInput: ITextConfig = {
    fieldKey: "ewayBillNo",
    attributes: {
      placeholder: "Search E-Way No",
      title: "E-Way No",
    },
  };
  poNoInput: ITextConfig = {
    fieldKey: "poNo",
    attributes: {
      placeholder: "Search PO Number",
      title: "PO Number",
    },
  };

  // Invoice Grid
  invoicesGrid: IGridConfig = {
    rowId: "id",
    gridHeightDelta: "calc(100vh - 500px)",
    pagination: true,
    emptyMessage: "No records found.",
    colDefs: [
      {
        field: "invoiceNo",
        headerName: "Invoice No",
        colType: "link",
      },
      {
        field: "customerName",
        headerName: "Customer",
        colType: "text",
      },
      {
        field: "invoiceDate",
        headerName: "Date",
        // showSelectFilter: true,
        colType: "text",
      },
      {
        field: "amount",
        headerName: "Amount",
        colType: "text",
      },
      {
        headerName: "Action",
        colType: "actions",
        align: "center",
        sortByFormatter: false,
        rendererParams: (value, row, col) => {
          return {
            type: "simple",
            row,
            actions: [
              {
                icon: "edit-write-1",
                action: "edit",
                tooltip: "Edit Invoice",
                title: "Edit Invoice",
                type: "edit",
                // disabled: row.showSteps,
              },
            ],
          };
        },
      },
    ],
  };

  // Create Invoice Config
  organizationSelectorConfig: ISelectConfig = {
    fieldKey: "organizationId",
    attributes: {
      class: "header-item",
      placeholder: "Select Organization",
      title: "Organization",
    },
    dataKey: "name",
    returnKey: "organizationId",
    options: [],
  };
  branchSelectorConfig: ISelectConfig = {
    fieldKey: "branchId",
    attributes: {
      class: "header-item",
      placeholder: "Select Branch",
      title: "Branch",
    },
    dataKey: "name",
    returnKey: "branchId",
    options: [],
  };
  customerSelectorConfig: ISelectConfig = {
    fieldKey: "customerId",
    attributes: {
      class: "header-item",
      placeholder: "Select Customer",
      title: "Bill to Customer",
    },
    dataKey: "name",
    returnKey: "customerId",
    options: [],
  };
  customerBranchSelectorConfig: ISelectConfig = {
    fieldKey: "customerBranchId",
    attributes: {
      class: "header-item",
      placeholder: "Select Customer Branch",
      title: "Customer Branch",
    },
    dataKey: "name",
    returnKey: "customerBranchId",
    options: [],
  };

  // Shipment Details
  mawbNoInput: ITextConfig = {
    fieldKey: "mawbNo",
    attributes: {
      title: "MAWB No",
      showBorder: true,
    },
  };
  hawbNoInput: ITextConfig = {
    fieldKey: "hawbNo",
    attributes: {
      title: "HAWB No",
      showBorder: true,
    },
  };
  sbNoInput: ITextConfig = {
    fieldKey: "sbNo",
    attributes: {
      title: "SB No",
      showBorder: true,
    },
  };
  packageQtyInput: ITextConfig = {
    fieldKey: "packageQty",
    attributes: {
      title: "Package (Qty)",
      type: "number",
      showBorder: true,
    },
  };
  chargeableWtInput: ITextConfig = {
    fieldKey: "chargeableWt",
    attributes: {
      title: "Chargeable (Wt)",
      showBorder: true,
      // Unit dropdown required
    },
  };
  grossWtInput: ITextConfig = {
    fieldKey: "grossWt",
    attributes: {
      title: "Gross (Wt)",
      showBorder: true,
      // Unit dropdown required
    },
  };
  netWtInput: ITextConfig = {
    fieldKey: "netWt",
    attributes: {
      title: "Net (Wt)",
      showBorder: true,
      // Unit dropdown required
    },
  };
  volumeInput: ITextConfig = {
    fieldKey: "volume",
    attributes: {
      title: "Volume",
      showBorder: true,
      // Unit dropdown required
    },
  };

  // Shipment (Airline Details)
  date1Input: ITextConfig = {
    fieldKey: "date1",
    attributes: {
      title: "Date 1",
      type: "datepicker",
      showBorder: true,
      // Validation Needed
    },
  };
  date2Input: ITextConfig = {
    fieldKey: "date2",
    attributes: {
      title: "Date 2",
      type: "datepicker",
      showBorder: true,
      // Validation Needed
    },
  };
  arrivalDateInput: ITextConfig = {
    fieldKey: "arrivalDate",
    attributes: {
      title: "Arrival Date",
      type: "datepicker",
      showBorder: true,
      // Validation Needed
    },
  };
  flightNoInput: ITextConfig = {
    fieldKey: "flightNo",
    attributes: {
      title: "Flight No",
      showBorder: true,
    },
  };
  cargoTypeSelectorConfig: ISelectConfig = {
    fieldKey: "cargoTypeId",
    attributes: {
      class: "header-item",
      title: "Cargo Type",
    },
    dataKey: "name",
    returnKey: "cargoTypeId",
    options: [
      {
        cargoTypeId: 1,
        name: "Airways",
      },
      {
        cargoTypeId: 2,
        name: "Waterways",
      },
      {
        cargoTypeId: 3,
        name: "Railways",
      },
      {
        cargoTypeId: 4,
        name: "Roadways",
      },
    ],
  };
  airlineSelectorConfig: ISelectConfig = {
    fieldKey: "airlineId",
    attributes: {
      class: "header-item",
      title: "Airline",
    },
    dataKey: "name",
    returnKey: "airlineId",
    options: [
      {
        airlineId: 1,
        name: "Air India",
      },
    ],
  };
  shipperRefInput: ITextConfig = {
    fieldKey: "shipperRef",
    attributes: {
      title: "Shipper Ref",
      showBorder: true,
    },
  };
  incoTermsInput: ITextConfig = {
    fieldKey: "incoTerms",
    attributes: {
      title: "Inco Terms",
      showBorder: true,
    },
  };
  // Consignee Details
  shipperInput: ITextConfig = {
    fieldKey: "shipper",
    attributes: {
      title: "Shipper",
      showBorder: true,
    },
  };
  consigneeInput: ITextConfig = {
    fieldKey: "consignee",
    attributes: {
      title: "Consignee",
      showBorder: true,
    },
  };
  placeOfRecieptInput: ITextConfig = {
    fieldKey: "placeOfReciept",
    attributes: {
      title: "Place of Reciept",
      showBorder: true,
    },
  };
  placeOfDeliveryInput: ITextConfig = {
    fieldKey: "placeOfDelivery",
    attributes: {
      title: "Place of Delivery",
      showBorder: true,
    },
  };
  loadingPortInput: ITextConfig = {
    fieldKey: "loadingPort",
    attributes: {
      title: "Loading Port",
      showBorder: true,
    },
  };
  dischargePortInput: ITextConfig = {
    fieldKey: "dischargePort",
    attributes: {
      title: "Discharge Port",
      showBorder: true,
    },
  };

  destinatonPortInput: ITextConfig = {
    fieldKey: "destinatonPort",
    attributes: {
      title: "Destinaton Port",
      showBorder: true,
    },
  };

  // Rate Details
  serviceTypeSelectorConfig: ISelectConfig = {
    fieldKey: "serviceTypeId",
    attributes: {
      class: "header-item",
      title: "Service Type",
    },
    dataKey: "name",
    returnKey: "serviceTypeId",
    options: [
      {
        serviceTypeId: 1,
        name: "AIR",
      },
    ],
  };

  hsnCodeInput: ITextConfig = {
    fieldKey: "hsnCode",
    attributes: {
      title: "HSN Code",
      type: "number",
      showBorder: true,
    },
  };

  currencySelectorConfig: ISelectConfig = {
    fieldKey: "currencyId",
    attributes: {
      class: "header-item",
      title: "Currency",
    },
    dataKey: "name",
    returnKey: "currencyId",
    options: [
      {
        currencyId: 1,
        name: "INR",
      },
    ],
  };
  quantityInput: ITextConfig = {
    fieldKey: "quantity",
    attributes: {
      title: "Quantity (in Kgs)",
      type: "number",
      showBorder: true,
    },
  };
  rateInput: ITextConfig = {
    fieldKey: "rate",
    attributes: {
      title: "Rate",
      type: "number",
      showBorder: true,
    },
  };
  amountInput: ITextConfig = {
    fieldKey: "amount",
    attributes: {
      title: "Amount",
      type: "number",
      // showBorder: true,
      readonly: true,
      disable: true,
    },
  };
  cgstRateInput: ITextConfig = {
    fieldKey: "cgstRate",
    attributes: {
      title: "CGST",
      // showBorder: true,
      readonly: true,
      disable: true,
    },
  };
  sgstRateInput: ITextConfig = {
    fieldKey: "sgstRate",
    attributes: {
      title: "SGST",
      // showBorder: true,
      readonly: true,
      disable: true,
    },
  };
  igstRateInput: ITextConfig = {
    fieldKey: "igstRate",
    attributes: {
      title: "IGST",
      // showBorder: true,
      readonly: true,
      disable: true,
    },
  };
  taxableAmountInput: ITextConfig = {
    fieldKey: "taxableAmount",
    attributes: {
      title: "Taxable Amount",
      type: "number",
      // showBorder: true,
      readonly: true,
      disable: true,
    },
  };
  totalAmountInput: ITextConfig = {
    fieldKey: "totalAmount",
    attributes: {
      title: "Total Amount",
      type: "number",
      // showBorder: true,
      readonly: true,
      disable: true,
    },
  };
  amountInWordsInput: ITextConfig = {
    fieldKey: "amountInWords",
    attributes: {
      title: "Amount In Words",
      // showBorder: true,
      readonly: true,
      disable: true,
    },
  };
  // Bank Details
  bankNameInput: ITextConfig = {
    fieldKey: "bankName",
    attributes: {
      title: "Bank Name",
      // showBorder: true,
      readonly: true,
      disable: true,
    },
  };
  bankBranchInput: ITextConfig = {
    fieldKey: "bankBranch",
    attributes: {
      title: "Branch Name",
      // showBorder: true,
      readonly: true,
      disable: true,
    },
  };
  acNoInput: ITextConfig = {
    fieldKey: "acNo",
    attributes: {
      title: "Bank Name",
      type: "number",
      // showBorder: true,
      readonly: true,
      disable: true,
    },
  };
  ifscCodeInput: ITextConfig = {
    fieldKey: "ifscCode",
    attributes: {
      title: "IFSC Code",
      // showBorder: true,
      readonly: true,
      disable: true,
    },
  };
  swiftCodeInput: ITextConfig = {
    fieldKey: "swiftCode",
    attributes: {
      title: "Swift Code",
      // showBorder: true,
      readonly: true,
      disable: true,
    },
  };
}
