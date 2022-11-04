export class CompanyDetails {
  organizationId: string;
  branchId!: string;
  customerId: string;
  customerBranchId!: string;
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
  airlineId: string;
  shipperRef!: string;
  incoTerms!: string;
}

export class ConsignmentDetails {
  shipper: string;
  consignee: string;
  placeOfReciept: string;
  placeOfDelivery: string;
  loadingPort: string;
  dischargePort: string;
  destinationPort: string;
}

export class RateDetails {
  serviceTypeId: string;
  hscCode: string;
  currencyId: string;
  quantity: number;
  rate: number;
  amount: number;
  cgstRate: string | number;
  sgstRate: string | number;
  igstRate: string | number;
  taxableAmount: number;
  totalAmount: number;
  amountInWords: string;
}

export class BankDetails {
  bankName: string;
  bankBranch: string;
  acNo: string;
  ifscCode: string;
  swiftCode: string;
}
