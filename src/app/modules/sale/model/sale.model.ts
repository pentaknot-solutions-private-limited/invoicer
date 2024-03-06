export class CustomerDetails {
  customerId: string | number;
  // type (business/ individual)
  customerTypeId?: string | number;
  salutationId?: string | number;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  // add
  // for org
  placeOfSupplyId?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  stateId?: string;
  pincode?: number;
  phone?: number;
  // docs
  panNo?: string;
  gstNo?: string;
}

export class SaleDetails {
  _id?: string;
  saleId?: string | number;
  customerId?: string | number;
  placeOfSupplyId?: string | number;
  posId?: string | number;
  dueTermId?: string | number;
  invoiceNo?: string | number;
  invoiceDate?: Date;
  dueDate?: Date;
  // REL with Sales Person Table
  salesPersonId?: string | number;
  subject?: string;
  saleItems?: Array<SaleItem>;
  exchangeItems?: Array<ExchangeItem>;
  saleTotal?: number;
  exchangeTotal?: number;
  subTotal?: number;
  tcsRateInPercentage?: number = 1; //1%
  tcs?: number;
  // subTotalAmount?: string;
  // discount?: string | number;
  // deducationTypeId?: string | number; // TCS/ TDS
  // deductionRateId?: string | number; // 1%, 5%, 10%
  totalAmount?: number;
  amountInWords?: string;
  notes?: string =
    "This is just a proforma, final invoice with signature will be produced against full payment.";
  termsAndConditions?: string;
  saleStatusId?: string | number; // saved, sent, partially_paid, paid, void


  customer?: any;
  status?; any;
}

export class SaleItem {
  saleItemId?: string | number;
  inventoryId?: string | number;
  carDetails?: any;
  hsnSacCode?: string | number;
  qty?: number; // default 1
  rate?: string | number;
  taxId?: string | number; //NA
  amount?: string | number;
}

export class ExchangeItem {
  exchangeItemId?: string | number;
  title?: string | any;
  year?: string | number;
  carNo?: string | any;
  carDetails?: any;
  hsnSacCode?: string | number;
  qty?: number; // default 1
  rate?: number;
  taxId?: string | number; //NA
  amount?: string | number;
}

export class LineItem {
  serviceTypeId: number;
  serviceName?: string;
  hsnCode: number;
  packageQty: number;
  chargeableWt: number;
  quantity: number;
  unitId: number;
  unitName?: string;
  rate: number;
  invoiceId?: number;
}
