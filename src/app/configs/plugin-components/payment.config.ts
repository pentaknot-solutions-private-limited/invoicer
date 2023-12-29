import { ITextConfig } from "src/app/shared/components/vsa-input/vsa-input.model";
import { ISelectConfig } from "src/app/shared/components/vsa-select-box/vsa-select-box.model";

export class PaymentConfig {
  customerSelect: ISelectConfig = {
    fieldKey: "customerId",
    attributes: {
      class: "header-item",
      title: "Customer",
      isMandatory: false,
      readonly: true,
      disable: true,
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

  paymentNumber: ITextConfig = {
    fieldKey: "paymentNumber",
    attributes: {
      title: "Payment#", //   showBorder: true,
      isMandatory: true,
      readonly: true,
      disable: true,
    },
  };

  amountReceived: ITextConfig = {
    fieldKey: "amountReceived",
    attributes: {
      title: "Amount Received (INR)",
      type: "number",
      isMandatory: true,
    },
  };
  bankCharges: ITextConfig = {
    fieldKey: "bankCharges",
    attributes: {
      title: "Bank Charges (if any)",
      type: "number",
      isMandatory: false,
    },
  };

  paymentDate: ITextConfig = {
    fieldKey: "paymentDate",
    attributes: {
      title: "Payment Date",
      type: "datepicker",
      isMandatory: true,
    },
  };

  paymentModeSelect: ISelectConfig = {
    fieldKey: "paymentModeId",
    attributes: {
      class: "header-item",
      title: "Payment Mode",
      isMandatory: false,
    },
    dataKey: "name",
    returnKey: "paymentModeId",
    options: [
      {
        paymentModeId: 1,
        name: "Cash",
      },
      {
        paymentModeId: 2,
        name: "UPI",
      },
      {
        paymentModeId: 3,
        name: "Bank Transfer",
      },
      {
        paymentModeId: 4,
        name: "Cheque",
      },
    ],
    searchBy: [
      {
        key: "name",
      },
    ],
    isMultiple: false,
  };
  referenceNumber: ITextConfig = {
    fieldKey: "referenceNumber",
    attributes: {
      title: "Reference#", //   showBorder: true,
      isMandatory: false,
    },
  };
  notes: ITextConfig = {
    fieldKey: "notes",
    attributes: {
      title: "Notes", //   showBorder: true,
      isMandatory: false,
    },
  };
}
