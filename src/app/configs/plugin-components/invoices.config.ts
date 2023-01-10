import * as moment from "moment";
import { IGridConfig } from "src/app/shared/components/vsa-grid/vsa-grid.model";
import { ITextConfig } from "src/app/shared/components/vsa-input/vsa-input.model";
import { ISelectConfig } from "src/app/shared/components/vsa-select-box/vsa-select-box.model";
import { dateFormatter } from "src/app/shared/utils/date-formatter";
import { EncryptedStorage } from "src/app/shared/utils/encrypted-storage";

export class InvoicesConfigs {
  // Search Box
  invoiceNoInput: ITextConfig = {
    fieldKey: "invoiceNo",
    attributes: {
      placeholder: "Search Invoice No",
      title: "Invoice No",
      maxlength: 16
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
    // gridHeightDelta: "calc(100vh - 510px)",
    gridHeightDelta: "calc(100vh - 410px)",
    pagination: true,
    emptyMessage: "No records found.",
    colDefs: [
      {
        field: "invoiceNo",
        headerName: "Invoice No",
        colType: "link",
        valueFormatter: (value, row, col) => {
          return row.invoiceNo ? row.invoiceNo : "-";
        },
      },
      {
        field: "customerName",
        headerName: "Customer",
        colType: "text",
        valueFormatter: (value, row, col) => {
          // console.log(row);
          return row?.companyDetails?.customer?.customerName
            ? row?.companyDetails?.customer?.customerName
            : "-";
        },
      },
      {
        field: "invoiceDate",
        headerName: "Date",
        // showSelectFilter: true,
        colType: "text",
        valueFormatter: (value, row, col) => {
          return row.invoiceDate ? dateFormatter(row.invoiceDate) : "-";
        },
      },
      {
        field: "amount",
        headerName: "Amount",
        colType: "text",
        valueFormatter: (value, row, col) => {
          return row.rateDetails.totalAmount
            ? row.rateDetails.totalAmount
            : "-";
        },
      },
      {
        field: "status",
        headerName: "Status",
        colType: "multi",
        rendererParams: (value, row, col) => {
          if (row.isIrnGenerated == 1) {
            return {
              fontSize: "12px",
              color: "green",
              fontWeight: 500,
              class: "completed",
            };
          } else {
            return {
              fontSize: "12px",
              color: "primary",
              fontWeight: 500,
            };
          }
        },
        valueFormatter: (value, row, col) => {
          return row.isIrnGenerated == 1
            ? 'Completed'
            : "Pending";
        },
      },
      {
        headerName: "Action",
        colType: "actions",
        align: "center",
        sortByFormatter: false,
        rendererParams: (value, row, col) => {
          const data = new EncryptedStorage().findItemFromAllStorage("_vsa-u");
          // Get all data from local storage
          const loggedInUserData = JSON.parse(data);
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
                disabled: row.isIrnGenerated == 1 ? true : false,
              },
              {
                icon: "download-button-2",
                action: "download",
                tooltip: "Download Invoice",
                title: "Download Invoice",
                type: "edit",
                // disabled: row.showSteps,
              },
              loggedInUserData?.role_id != 3 ? {
                icon: "data-file-bars",
                action: "generate-irn",
                tooltip: "Generate IRN",
                title: "Generate IRN",
                type: "edit",
                size: 'small',
                disabled: row.isCompleted == 1 && row.isIrnGenerated == 1 ? true : false,
              } : {},
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
    returnKey: "id",
    options: [],
    isMultiple: false
  };
  branchSelectorConfig: ISelectConfig = {
    fieldKey: "organizationBranchId",
    attributes: {
      class: "header-item",
      placeholder: "Select Branch",
      title: "Branch",
    },
    dataKey: "name",
    returnKey: "organizationBranchId",
    options: [],
    isMultiple: false
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
    isMultiple: false
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
    isMultiple: false
  };

  invoiceNoGenerationInput: ITextConfig = {
    fieldKey: "invoiceNo",
    attributes: {
      title: "Invoice No.",
      showBorder: true,
      maxlength: 16,
      isMandatory: true
      // hint: "Note: If no Invoice No. is entered it will be generated automatically.",
    },
  };

  invoiceDateInput: ITextConfig = {
    fieldKey: "invoiceDate",
    attributes: {
      title: "Invoice Date",
      type: "datepicker",
      showBorder: true,
      isMandatory: true
    },
  };

  invoiceDueDateInput: ITextConfig = {
    fieldKey: "invoiceDueDate",
    attributes: {
      title: "Invoice Due Date",
      type: "datepicker",
      showBorder: true,
    },
  };

  // Shipment Details
  awbNoInput: ITextConfig = {
    fieldKey: "awbNo",
    attributes: {
      title: "AWB No",
      showBorder: true,
      isMandatory: true
    },
  };
  dispatchDocNoInput: ITextConfig = {
    fieldKey: "dispatchDocNo",
    attributes: {
      title: "CD No",
      showBorder: true
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
      title: "Pcs (Qty)",
      type: "number",
      showBorder: true,
      isMandatory: true
    },
  };
  chargeableWtInput: ITextConfig = {
    fieldKey: "chargeableWt",
    attributes: {
      title: "Chargeable Wt.",
      showBorder: true,
      type: "number",
      isMandatory: true
      // Unit dropdown required
    },
  };
  grossWtInput: ITextConfig = {
    fieldKey: "grossWt",
    attributes: {
      title: "Gross Weight in KGs",
      showBorder: true,
      type: "number",
      isMandatory: true
      // Unit dropdown required
    },
  };
  netWtInput: ITextConfig = {
    fieldKey: "netWt",
    attributes: {
      title: "Net (Wt)",
      showBorder: true,
      type: "number",
      // Unit dropdown required
    },
  };
  volumeInput: ITextConfig = {
    fieldKey: "volume",
    attributes: {
      title: "Volume",
      showBorder: true,
      type: "number",
      // Unit dropdown required
    },
  };

  // Shipment (Airline Details)
  date1Input: ITextConfig = {
    fieldKey: "date1",
    attributes: {
      title: "Departure Date",
      type: "datepicker",
      showBorder: true,
      isMandatory: true
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
  departureDateInput: ITextConfig = {
    fieldKey: "departureDate",
    attributes: {
      title: "Departure Date",
      type: "datepicker",
      showBorder: true,
      isMandatory: true
      // Validation Needed
    },
  };
  flightNoInput: ITextConfig = {
    fieldKey: "flightNo",
    attributes: {
      title: "Flight No",
      showBorder: true,
      isMandatory: true
    },
  };
  cargoTypeSelectorConfig: ISelectConfig = {
    fieldKey: "cargoTypeId",
    attributes: {
      class: "header-item",
      title: "Cargo Type",
      isMandatory: true
    },
    dataKey: "name",
    returnKey: "cargoTypeId",
    options: [],
    isMultiple: false
  };
  airlineSelectorConfig: ISelectConfig = {
    fieldKey: "airlineId",
    attributes: {
      class: "header-item",
      title: "Airline",
    },
    dataKey: "name",
    returnKey: "id",
    options: [],
    isMultiple: false
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
  shipperSelect: ISelectConfig = {
    fieldKey: "shipperId",
    attributes: {
      type: 'select-search',
      class: "header-item",
      title: "Shipper",
    },
    dataKey: "name",
    returnKey: "shipperId",
    options: [],
    searchBy: [
      {
        key: "name",
      },
    ],
    isMultiple: false
  };

  consigneeSelect: ISelectConfig = {
    fieldKey: "consigneeId",
    attributes: {
      type: 'select-search',
      class: "header-item",
      title: "Consignee"
    },
    dataKey: "name",
    returnKey: "consigneeId",
    options: [],
    searchBy: [
      {
        key: "name",
      },
    ],
    isMultiple: false
  };

  recieptCountrySelect: ISelectConfig = {
    fieldKey: "recieptCountry",
    attributes: {
      type: 'select-search',
      class: "header-item",
      title: "Country",
    },
    dataKey: "name",
    returnKey: "isoCode",
    options: [],
    searchBy: [
      {
        key: "name",
      },
    ],
    isMultiple: false
  };

  recieptStateSelect: ISelectConfig = {
    fieldKey: "recieptState",
    attributes: {
      type: 'select-search',
      class: "header-item",
      title: "State",
      disable: true,
    },
    dataKey: "name",
    returnKey: "isoCode",
    options: [],
    searchBy: [
      {
        key: "name",
      },
    ],
    isMultiple: false
  };

  recieptCitySelect: ISelectConfig = {
    fieldKey: "recieptCity",
    attributes: {
      type: 'select-search',
      class: "header-item",
      title: "City",
      disable: true,
    },
    dataKey: "name",
    returnKey: "name",
    options: [],
    searchBy: [
      {
        key: "name",
      },
    ],
    isMultiple: false
  };

  deliveryCountrySelect: ISelectConfig = {
    fieldKey: "deliveryCountry",
    attributes: {
      type: 'select-search',
      class: "header-item",
      title: "Country",
    },
    dataKey: "name",
    returnKey: "isoCode",
    options: [],
    searchBy: [
      {
        key: "name",
      },
    ],
    isMultiple: false
  };

  deliveryStateSelect: ISelectConfig = {
    fieldKey: "deliveryState",
    attributes: {
      type: 'select-search',
      class: "header-item",
      title: "State",
      disable: true,
    },
    dataKey: "name",
    returnKey: "isoCode",
    options: [],
    searchBy: [
      {
        key: "name",
      },
    ],
    isMultiple: false
  };

  deliveryCitySelect: ISelectConfig = {
    fieldKey: "deliveryCity",
    attributes: {
      class: "header-item",
      title: "City",
      disable: true,
    },
    dataKey: "name",
    returnKey: "name",
    options: [],
    searchBy: [
      {
        key: "name",
      },
    ],
    isMultiple: false
  };

  loadingPortSelect: ISelectConfig = {
    fieldKey: "loadingPortId",
    attributes: {
      class: "header-item",
      title: "Loading Port",
      isMandatory: true
    },
    dataKey: "name",
    returnKey: "loadingPortId",
    options: [],
    searchBy: [
      {
        key: "name",
      },
    ],
    isMultiple: false
  };

  dischargePortSelect: ISelectConfig = {
    fieldKey: "dischargePortId",
    attributes: {
      class: "header-item",
      title: "Discharge Port",
    },
    dataKey: "name",
    returnKey: "id",
    options: [],
    searchBy: [
      {
        key: "name",
      },
    ],
    isMultiple: false
  };

  destinationPortSelect: ISelectConfig = {
    fieldKey: "destinationPortId",
    attributes: {
      type: 'select-search',
      class: "header-item",
      title: "Destination Port",
      isMandatory: true
    },
    dataKey: "name",
    returnKey: "id",
    options: [],
    searchBy: [
      {
        key: "name",
      },
    ],
    isMultiple: false
  };

  destinatonPortCountrySelect: ISelectConfig = {
    fieldKey: "countryId",
    attributes: {
      type: 'select-search',
      class: "header-item",
      title: "Destination Port Country",
      isMandatory: true
    },
    dataKey: "name",
    returnKey: "countryId",
    options: [],
    searchBy: [
      {
        key: "name",
      },
    ],
    isMultiple: false
    
  };

  // Rate Details
  serviceTypeSelectorConfig: ISelectConfig = {
    fieldKey: "serviceTypeId",
    attributes: {
      class: "header-item",
      title: "Service Type",
      isMandatory: true
    },
    dataKey: "name",
    returnKey: "serviceTypeId",
    options: [],
    disableBoolKey: 'disabled',
    isMultiple: false
  };

  unitConfig: ISelectConfig = {
    fieldKey: "unitId",
    attributes: {
      class: "header-item",
      title: "Unit",
    },
    dataKey: "name",
    returnKey: "unitId",
    options: [],
    isMultiple: false
  };

  hsnCodeInput: ITextConfig = {
    fieldKey: "hsnCode",
    attributes: {
      title: "HSN Code",
      type: "number",
      disable: true,
      readonly: true,
      showBorder: true,
      max: 999999
      
    },
  };

  currencySelectorConfig: ISelectConfig = {
    fieldKey: "currencyId",
    attributes: {
      class: "header-item",
      title: "Currency",
    },
    dataKey: "name",
    returnKey: "id",
    options: [
      {
        currencyId: 1,
        name: "INR",
      },
    ],
    isMultiple: false
  };
  quantityInput: ITextConfig = {
    fieldKey: "quantity",
    attributes: {
      title: "Quantity",
      type: "number",
      showBorder: true,
      isMandatory: true
    },
  };
  rateInput: ITextConfig = {
    fieldKey: "rate",
    attributes: {
      title: "Rate",
      type: "number",
      showBorder: true,
      isMandatory: true
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
      title: "Total Amount (Round Off)",
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
    fieldKey: "name",
    attributes: {
      title: "Bank Name",
      // showBorder: true,
      readonly: true,
      disable: true,
    },
  };
  bankBranchInput: ITextConfig = {
    fieldKey: "branchName",
    attributes: {
      title: "Branch Name",
      // showBorder: true,
      readonly: true,
      disable: true,
    },
  };
  acNoInput: ITextConfig = {
    fieldKey: "accountNumber",
    attributes: {
      title: "Account Number",
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
