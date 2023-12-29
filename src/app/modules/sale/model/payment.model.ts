export class PaymentDetails {
  paymentId?: string | number;
  paymentNumber?: string | number;
  customerId?: string | number;
  saleId?: string | number; // InvoiceId
  inventoryId?: string | number;
  invoiceNumber?: string | number;
  amountReceived?: number;
  bankCharges?: number;
  paymentDate?: Date;
  paymentModeId?: number | string; // Cash, Cheque, Bank Transfer,
  referenceNumber?: number | string;
  notes?: string;
  attachments?: Attachment[];
}

export class Attachment {
  attachmentId?: number | string;
  name?: string;
  url?: string;
}
