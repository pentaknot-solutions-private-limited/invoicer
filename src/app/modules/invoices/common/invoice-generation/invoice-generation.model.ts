export class CompanyDetails {
  organizationId: string;
  organizationBranchId!: string;
  customerId: string;
  customerBranchId!: string;
  invoiceNo!: string;
  invoiceDate!: Date;
  invoiceDueDate!: Date;
}
export class ShipmentDetails {
  mawbNo: string;
  hawbNo: string;
  sbNo: string;
  packageQty: string;
  chargeableWt: number;
  grossWt: number;
  netWt: number;
  volume: number;
  date1: Date;
  date2: Date;
  arrivalDate: Date;
  flightNo: string;
  cargoTypeId: string;
  airlineId: string;
  shipperRef!: string;
  incoTerms!: string;
  
}

export class ConsignmentDetails {
  shipperId: string;
  consigneeId: string;
  placeOfRecieptId: string | number;
  placeOfDeliveryId: string | number;
  loadingPortId: string;
  dischargePortId: string;
  destinatonPortId: string;
}

export class RateDetails {
  serviceTypeId: string;
  hsnCode: string;
  currencyId: string;
  quantity: number;
  rate: number;
  amount: string | number;
  cgstRate: string | number;
  sgstRate: string | number;
  igstRate: string | number;
  taxableAmount: number | string;
  totalAmount: number | string;
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
}