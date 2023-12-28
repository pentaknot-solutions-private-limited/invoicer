import { IDateTimeConfig } from "src/app/shared/components/vsa-datetime-picker/vsa-datetime-picker.model";
import { IGridConfig } from "src/app/shared/components/vsa-grid/vsa-grid.model";
import { ITextConfig } from "src/app/shared/components/vsa-input/vsa-input.model";
import { ISelectConfig } from "src/app/shared/components/vsa-select-box/vsa-select-box.model";
import { dateFormatter } from "src/app/shared/utils/date-formatter";
import { EncryptedStorage } from "src/app/shared/utils/encrypted-storage";
import { formatIndianCurrency } from "src/app/shared/utils/format-indian-currency";

export class SaleConfig {
  customerSelect: ISelectConfig = {
    fieldKey: "customerId",
    attributes: {
      class: "header-item",
      title: "Customer",
      isMandatory: false,
    },
    dataKey: "name",
    returnKey: "customerId",
    options: [],
    searchBy: [
      {
        key: "name",
      },
    ],
    isMultiple: false,
  };

  placeOfSupplySelect: ISelectConfig = {
    fieldKey: "posId",
    attributes: {
      class: "header-item",
      title: "Place of supply",
      isMandatory: false,
    },
    dataKey: "name",
    returnKey: "posId",
    options: [
      {
        posId: 27,
        name: "(MH) - Maharashtra",
      },
    ],
    searchBy: [
      {
        key: "name",
      },
    ],
    isMultiple: false,
  };

  invoiceNumber: ITextConfig = {
    fieldKey: "invoiceNumber",
    attributes: {
      title: "Invoice#", //   showBorder: true,
      isMandatory: true,
    },
  };
  invoiceDate: ITextConfig = {
    fieldKey: "invoiceDate",
    attributes: {
      title: "Invoice Date",
      type: "datepicker",
      isMandatory: false,
    },
  };

  dueDate: ITextConfig = {
    fieldKey: "dueDate",
    attributes: {
      title: "Due Date",
      type: "datepicker",
      isMandatory: false,
    },
  };
  inventorySelect: ISelectConfig = {
    fieldKey: "carDetailId",
    attributes: {
      class: "header-item",
      title: "Car",
      isMandatory: false,
    },
    dataKey: "name",
    returnKey: "carDetailId",
    options: [],
    // searchBy: [
    //   {
    //     key: "name",
    //   },
    // ],
    // isMultiple: false,
  };

  // Form Array Table

  unitConfig: ISelectConfig = {
    fieldKey: "unitId",
    attributes: {
      class: "header-item",
      title: "Unit",
    },
    dataKey: "name",
    returnKey: "unitId",
    options: [],
    isMultiple: false,
  };

  hsnSacCodeInput: ITextConfig = {
    fieldKey: "hsnSacCode",
    attributes: {
      title: "HSN/ SAC",
      type: "number",
      disable: true,
      readonly: true,
      max: 999999,
    },
  };
  quantityInput: ITextConfig = {
    fieldKey: "qty",
    attributes: {
      title: "Qty.",
      type: "number",
      isMandatory: true,
    },
  };
  rateInput: ITextConfig = {
    fieldKey: "rate",
    attributes: {
      // title: "Rate",
      title: "Amount",
      type: "number",
      isMandatory: true,
      // readonly: true,
      // disable: true,
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
}
