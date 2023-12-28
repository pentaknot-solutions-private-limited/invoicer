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
