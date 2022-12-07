export class CompanyDetails {
  organizationId: string;
  organizationBranchId!: string;
  customerId: string;
  customerBranchId!: string;
  companyCode: string;
  cityCode: string;
}
export class ShipmentDetails {
  shipperId: string;
  consigneeId: string;
  awbNo: string;
  hawbNo: string; // Not required
  sbNo: string; // Not required
  packageQty: number;
  chargeableWt: number;
  grossWt: number;
  netWt: number; // Not required
  volume: number; // Not required
  date1: Date; // Not required
  date2: Date; // Not required
  departureDate: Date;
  flightNo: string;
  cargoTypeId: string;
  airlineId: string; // Not required
  shipperRef!: string; // Not required
  incoTerms!: string; // Not required
  loadingPortId: string;
  destinatonPortId: string;
  dispatchDocNo: string;
}

export class ConsignmentDetails {
  placeOfRecieptId: string | number;
  placeOfDeliveryId: string | number;
}

export class RateDetails {
  // serviceTypeId: string;
  // hsnCode: string | number;
  // quantity: number;
  // unit?: string;
  currencyId: string;
  rate: number;
  amount: any;
  cgstRate: string | number;
  sgstRate: string | number;
  igstRate: string | number;
  taxableAmount: any;
  totalAmount: any;
  amountInWords: string;
}

export class BankDetails {
  ORGID: number;
  accountNumber: string;
  branchName: string;
  createdAt: string;
  createdBy: string;
  id: number;
  ifscCode: string;
  ipAddress: string;
  isActive: number;
  isDeleted: number;
  modifiedAt: string;
  modifiedBy: null;
  name: string;
  swiftCode: string;
}

export class LocationModel {
  recieptCountry: string;
  deliveryCountry: string;
  recieptState: string;
  deliveryState: string;
  recieptcity: string;
  deliverycity: string;
  countryId: number;
}

export class LineItem {
  serviceTypeId: number;
  hsnCode: number;
  packageQty: number;
  chargeableWt: number;
  quantity: number;
  unitId: number;
  rate: number;
  invoiceId?: number
}

export class BasicDetails {
  invoiceNo!: string;
  invoiceDate!: Date;
  invoiceDueDate!: Date;
}