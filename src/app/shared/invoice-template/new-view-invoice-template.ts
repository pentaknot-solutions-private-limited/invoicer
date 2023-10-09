import * as _ from "lodash";
import * as moment from "moment";
// import moment from 'moment';
import * as pdf from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { Dummy_Stamp } from "./dummy-stamp";
import { Dummy_QR } from "./dummy-qr";
import { Dummy_Logo } from "./dummy-logo";
const pdfMake = pdf;
pdfMake.vfs = pdfFonts.pdfMake.vfs;

interface bindingDataModel {
  invoiceData: any;
}

export class InvoicePDF {
  private dummyLogo = Dummy_Logo;
  private dummyQR = Dummy_QR;
  // Stamp Image
  private stampBase64 = Dummy_Stamp;
  private bindingData: bindingDataModel;
  private documentDefinition: any;
  gstTotalAmt: any;
  totalItemValue: number;
  // stampBase64
  constructor(bindingData: bindingDataModel) {
    this.bindingData = bindingData;
    this.documentDefinition = this.getDocumentDefinition();
  }

  downloadPdf(fileName: string) {
    pdfMake.createPdf(this.documentDefinition).download(`PDF_` + fileName);
  }

  openPdf() {
    const newWin = window.open("", "_blank");
    pdfMake.createPdf(this.documentDefinition).open({}, newWin);
  }

  getBase64() {
    return new Promise<string>((resolve) => {
      pdfMake.createPdf(this.documentDefinition).getBase64((data) => {
        const base64 = data;
        if (base64) {
          resolve(base64);
        }
      });
    });
  }

  getArrayBuffer() {
    return new Promise<string>((resolve) => {
      pdfMake.createPdf(this.documentDefinition).getBuffer((data) => {
        const arrayBuffer = data;
        if (arrayBuffer) {
          resolve(arrayBuffer);
        }
      });
    });
  }

  // Template Start

  private getDocumentDefinition() {
    return {
      content: [
        this.createOrgStrip(this.bindingData.invoiceData),
        this.taxInvoiceDetails(this.bindingData.invoiceData),
        this.createInvoiceTable(this.bindingData.invoiceData),
        this.createFooter(this.bindingData.invoiceData),
        // this.createHSNTable(this.bindingData.invoiceData),
        // this.createRemark(this.bindingData.invoiceData),
        // this.createDeclaration(this.bindingData.invoiceData),
      ],
      styles: [],
      pageMargins: [0, 0, 0, 0],
    };
  }

  private createFooter(invoiceData: any) {
    const template = {
      text: `Registered Address:- Flat No. 02, Gulshan Mahal, behind Axis Bank, L.J. Road, Mahim West,
      Mumbai, Mumbai Suburban, Maharashtra, 400016`,
      bold: false,
      fontSize: 10,
      alignment: "center",
      margin: [0, 5, 0, 5],
    };
    return template;
  }

  private createOrgStrip(invoiceData: any) {
    console.log(invoiceData);

    const template = {
      columns: [
        {
          stack: [
            {
              image: this.dummyLogo,
              width: 100,
              height: 100,
            },
          ],
          width: 100,
        },
        {
          stack: [
            {
              text: `TAX INVOICE`,
              bold: true,
              fontSize: 14,
              margin: [0, 16, 0, 16],
            },
            {
              text: `${invoiceData?.companyDetails?.organization?.name}`,
              fontSize: 12,
              color: `#25688e`,
              bold: true,
              alignment: `center`,
              margin: [0, 0, 0, 16],
            },
            {
              text: `${invoiceData?.companyDetails?.organization?.address}`,
              fontSize: 10,
              color: `#191919`,
              alignment: `center`,
              margin: [0, 0, 0, 16],
            },
            {
              columns: [
                {
                  stack: [
                    {
                      columns: [
                        {
                          stack: [
                            {
                              text: `State:`,
                              fontSize: 8,
                              alignment: `left`,
                              bold: true,
                            },
                          ],
                          width: "20%",
                        },
                        {
                          stack: [
                            {
                              text: `[${invoiceData?.companyDetails?.organization?.stateTinCode}] ${invoiceData?.companyDetails?.organization?.stateName}`,
                              fontSize: 8,
                              alignment: `left`,
                            },
                          ],
                          width: "80%",
                        },
                      ],
                      columnGap: 2,
                    },
                  ],
                  width: "45%",
                },
                {
                  stack: [
                    {
                      columns: [
                        {
                          stack: [
                            {
                              text: `GSTIN/UIN:`,
                              fontSize: 8,
                              alignment: `left`,
                              bold: true,
                            },
                          ],
                          width: "35%",
                        },
                        {
                          stack: [
                            {
                              text: `${invoiceData?.companyDetails?.organization?.gstin}`,
                              fontSize: 8,
                              alignment: `left`,
                            },
                          ],
                          width: "65%",
                        },
                      ],
                      columnGap: 2,
                    },
                  ],
                  width: "55%",
                },
              ],
            },
            {
              columns: [
                {
                  stack: [
                    {
                      columns: [
                        {
                          stack: [
                            {
                              text: `CIN No:`,
                              fontSize: 8,
                              alignment: `left`,
                              bold: true,
                            },
                          ],
                          width: "20%",
                        },
                        {
                          stack: [
                            {
                              text: `${
                                invoiceData?.companyDetails?.organization?.cinNo
                                  ? invoiceData?.companyDetails?.organization
                                      ?.cinNo
                                  : "U63090MH2020PTC338237"
                              }`,
                              fontSize: 8,
                              alignment: `left`,
                            },
                          ],
                          width: "80%",
                        },
                      ],
                      columnGap: 2,
                    },
                  ],
                  width: "45%",
                },
                {
                  stack: [
                    {
                      columns: [
                        {
                          stack: [
                            {
                              text: `PAN No:`,
                              fontSize: 8,
                              alignment: `left`,
                              bold: true,
                            },
                          ],
                          width: "35%",
                        },
                        {
                          stack: [
                            {
                              text: `${
                                invoiceData?.companyDetails?.organization
                                  ?.pancardNo
                                  ? invoiceData?.companyDetails?.organization
                                      ?.pancardNo
                                  : "AACCU5773F"
                              }`,
                              fontSize: 8,
                              alignment: `left`,
                            },
                          ],
                          width: "65%",
                        },
                      ],
                      columnGap: 2,
                    },
                  ],
                  width: "55%",
                },
              ],
            },
          ],
          alignment: `center`,
          width: `*`,
        },
        {
          stack: [
            invoiceData?.qrCode
              ? {
                  image: invoiceData?.qrCode ? invoiceData?.qrCode : "",
                  width: 150,
                  height: 150,
                }
              : {},
          ],
          alignment: `center`,
          width: 150,
        },
      ],
      columnGap: 5,
      margin: [10, 10, 0, 6],
    };
    return template;
  }

  private taxInvoiceDetails(invoiceData: any) {
    const template = {
      stack: [
        {
          columns: [
            {
              stack: [
                { text: `IRN`, fontSize: 10 },
                // { text: `Ack No.`, fontSize: 10 },
                // { text: `Ack Date`, fontSize: 10 },
              ],
              width: 60,
            },
            {
              stack: [
                { text: `:`, fontSize: 10 },
                // { text: `:`, fontSize: 10 },
                // { text: `:`, fontSize: 10 },
              ],
              width: 12,
            },
            {
              stack: [
                {
                  text: `${invoiceData?.irn ? invoiceData?.irn : "-"}`,
                  bold: true,
                  fontSize: 10,
                },
                // {
                //   text: `${invoiceData?.ackNo ? invoiceData?.ackNo : "-"}`,
                //   bold: true,
                //   fontSize: 10,
                // },
                // {
                //   text: `${invoiceData?.ackDate ? invoiceData?.ackDate : "-"}`,
                //   bold: true,
                //   fontSize: 10,
                // },
                // { text: `${invoiceData?.ackDate ? moment(invoiceData?.ackDate).format('DD-MMM-YYYY') : '-'}`, bold: true, fontSize: 10 },
              ],
              width: `*`,
              alignment: `left`,
            },
          ],
          columnGap: 10,
          margin: [10, 10, 10, 6],
        },
        {
          columns: [
            {
              stack: [
                { text: `Recipient :`, fontSize: 10, bold: true },
                {
                  text: `${
                    invoiceData?.companyDetails?.customer?.name ||
                    invoiceData?.companyDetails?.customer?.customerName
                  }`,
                  fontSize: 11,
                  bold: true,
                },
                {
                  text: `${invoiceData?.companyDetails?.customer?.address}`,
                  fontSize: 10,
                },
                {
                  text: `${invoiceData?.companyDetails?.customer?.address2}`,
                  fontSize: 10,
                },
                {
                  columns: [
                    {
                      stack: [
                        {
                          columns: [
                            {
                              stack: [
                                {
                                  text: `PAN No:`,
                                  fontSize: 10,
                                  alignment: `left`,
                                  bold: true,
                                },
                              ],
                              width: "30%",
                            },
                            {
                              stack: [
                                {
                                  text: `${invoiceData?.companyDetails?.customer?.gstin
                                    ?.slice(0, -3)
                                    .substring(2)}`,
                                  fontSize: 10,
                                  alignment: `left`,
                                },
                              ],
                              width: "70%",
                            },
                          ],
                          columnGap: 2,
                        },
                      ],
                      width: "50%",
                    },
                  ],
                },
                {
                  columns: [
                    {
                      stack: [
                        {
                          columns: [
                            {
                              stack: [
                                {
                                  text: `GSTIN:`,
                                  fontSize: 10,
                                  alignment: `left`,
                                  bold: true,
                                },
                              ],
                              width: "20%",
                            },
                            {
                              stack: [
                                {
                                  text: `${invoiceData?.companyDetails?.customer?.gstin}`,
                                  fontSize: 10,
                                  alignment: `left`,
                                },
                              ],
                              width: "80%",
                            },
                          ],
                          columnGap: 2,
                        },
                      ],
                      width: "60%",
                    },
                    {
                      stack: [
                        {
                          columns: [
                            {
                              stack: [
                                {
                                  text: `State:`,
                                  fontSize: 10,
                                  alignment: `left`,
                                  bold: true,
                                },
                              ],
                              width: "30%",
                            },
                            {
                              stack: [
                                {
                                  text: `[${invoiceData?.companyDetails?.customer?.stateTinCode}] ${invoiceData?.companyDetails?.customer?.stateName}`,
                                  fontSize: 10,
                                  alignment: `left`,
                                },
                              ],
                              width: "70%",
                            },
                          ],
                          columnGap: 0,
                        },
                      ],
                      width: "45%",
                    },
                  ],
                },
              ],
              alignment: `left`,
              width: "50%",
            },
            {
              stack: [
                {
                  columns: [
                    {
                      stack: [
                        {
                          columns: [
                            {
                              stack: [
                                {
                                  text: `Invoice No. :`,
                                  fontSize: 12,
                                  alignment: `right`,
                                  bold: true,
                                },
                              ],
                              width: "50%",
                            },
                            {
                              stack: [
                                {
                                  text: `${invoiceData?.invoiceNo}`,
                                  fontSize: 12,
                                  alignment: `right`,
                                  bold: true,
                                },
                              ],
                              width: "50%",
                            },
                          ],
                          columnGap: 2,
                        },
                        {
                          columns: [
                            {
                              stack: [
                                {
                                  text: `Invoice Date :`,
                                  fontSize: 10,
                                  alignment: `right`,
                                  bold: true,
                                },
                              ],
                              width: "50%",
                            },
                            {
                              stack: [
                                {
                                  text: `${
                                    invoiceData?.invoiceDate
                                      ? moment(invoiceData?.invoiceDate).format(
                                          "DD-MMM-YYYY"
                                        )
                                      : ""
                                  }`,
                                  fontSize: 10,
                                  alignment: `right`,
                                },
                              ],
                              width: "50%",
                            },
                          ],
                          columnGap: 2,
                        },
                        {
                          columns: [
                            {
                              stack: [
                                {
                                  text: `Invoice Due Date :`,
                                  fontSize: 10,
                                  alignment: `right`,
                                  bold: true,
                                },
                              ],
                              width: "50%",
                            },
                            {
                              stack: [
                                {
                                  text: `${
                                    invoiceData?.invoiceDueDate
                                      ? moment(
                                          invoiceData?.invoiceDueDate
                                        ).format("DD-MMM-YYYY")
                                      : ""
                                  }`,
                                  fontSize: 10,
                                  alignment: `right`,
                                },
                              ],
                              width: "50%",
                            },
                          ],
                          columnGap: 2,
                        },
                        {
                          columns: [
                            {
                              stack: [
                                {
                                  text: `Place of Supply :`,
                                  fontSize: 10,
                                  alignment: `right`,
                                  bold: true,
                                },
                              ],
                              width: "50%",
                            },
                            {
                              stack: [
                                {
                                  // text: `${invoiceData?.shipmentDetails?.placeOfSupply}`,
                                  text: `${invoiceData?.companyDetails?.customerBranch?.name}`,
                                  fontSize: 10,
                                  alignment: `right`,
                                },
                              ],
                              width: "50%",
                            },
                          ],
                          columnGap: 2,
                        },
                        // {
                        //   columns: [
                        //     {
                        //       stack: [
                        //         {
                        //           text: `Shipment No. :`,
                        //           fontSize: 10,
                        //           alignment: `right`,
                        //           bold: true,
                        //         },
                        //       ],
                        //       width: "50%",
                        //     },
                        //     {
                        //       stack: [
                        //         {
                        //           text: ``,
                        //           fontSize: 10,
                        //           alignment: `right`,
                        //         },
                        //       ],
                        //       width: "50%",
                        //     },
                        //   ],
                        //   columnGap: 2,
                        // },
                        // {
                        //   columns: [
                        //     {
                        //       stack: [
                        //         {
                        //           text: `Shipment Type :`,
                        //           fontSize: 10,
                        //           alignment: `right`,
                        //           bold: true,
                        //         },
                        //       ],
                        //       width: "50%",
                        //     },
                        //     {
                        //       stack: [
                        //         {
                        //           text: ``,
                        //           fontSize: 10,
                        //           alignment: `right`,
                        //         },
                        //       ],
                        //       width: "50%",
                        //     },
                        //   ],
                        //   columnGap: 2,
                        // },
                      ],
                      width: "100%",
                    },
                  ],
                },
              ],
              alignment: `right`,
              width: "50%",
            },
          ],
          margin: [10, 10, 10, 6],
        },
      ],
      width: `75%`,
    };
    return template;
  }

  private createInvoiceTable(invoiceData: any) {
    // data
    console.log(invoiceData?.rateDetails);

    const costItems = [
      {
        description: `Air Freight`,
        hsn: 996531,
        quantity: 1357,
        unit: `kgs`,
        rate: 95,
        amount: 128915,
      },
      {
        description: `Other Charges`,
        hsn: 996533,
        quantity: 1,
        unit: `u`,
        rate: 800,
        amount: 800,
      },
    ];
    const gstInfo = {
      percent: 18,
      value: 23348.7,
    };

    const table = {
      table: {
        widths: [15, 60, 27, 20, 40, 25, 40, 30, 50, 22, 22, 21, "*", 40],
        body: [
          [
            {
              colSpan: 8,
              stack: [
                {
                  columns: [
                    {
                      stack: [
                        {
                          text: [
                            { text: `MAWB No. : `, bold: true },
                            invoiceData?.shipmentDetails?.awbNo,
                          ],
                          fontSize: 10,
                          alignment: `left`,
                        },
                      ],
                      width: "60%",
                    },
                    {
                      stack: [
                        {
                          text: [{ text: `Date : `, bold: true }, ``],
                          fontSize: 10,
                          alignment: `left`,
                        },
                      ],
                      width: "40%",
                    },
                  ],
                },
                {
                  columns: [
                    {
                      stack: [
                        {
                          text: [{ text: `HAWB No. : `, bold: true }, ``],
                          fontSize: 10,
                          alignment: `left`,
                        },
                      ],
                      width: "60%",
                    },
                    {
                      stack: [{}],
                      width: "40%",
                    },
                  ],
                },
                // {
                //   columns: [
                //     {
                //       stack: [
                //         {
                //           text: [{ text: `SB No. : `, bold: true }, ``],
                //           fontSize: 10,
                //           alignment: `left`,
                //         },
                //       ],
                //       width: "60%",
                //     },
                //     {
                //       stack: [
                //         {
                //           text: [{ text: `Date : `, bold: true }, ``],
                //           fontSize: 10,
                //           alignment: `left`,
                //         },
                //       ],
                //       width: "40%",
                //     },
                //   ],
                // },
                {
                  columns: [
                    {
                      stack: [
                        {
                          text: [
                            { text: `Cargo Type : `, bold: true },
                            `${invoiceData?.shipmentDetails?.cargoTypeName}`,
                          ],
                          fontSize: 10,
                          alignment: `left`,
                        },
                      ],
                      width: "60%",
                    },
                    {
                      stack: [
                        {
                          text: [{ text: `Volume : `, bold: true }, ``],
                          fontSize: 10,
                          alignment: `left`,
                        },
                      ],
                      width: "40%",
                    },
                  ],
                },
                {
                  columns: [
                    {
                      stack: [
                        {
                          text: [
                            { text: `Packages : `, bold: true },
                            `${invoiceData?.shipmentDetails?.packageQty} NOS`,
                          ],
                          fontSize: 10,
                          alignment: `left`,
                        },
                      ],
                      width: "60%",
                    },
                    {
                      stack: [
                        {
                          text: [
                            { text: `Gross Wt. : `, bold: true },
                            `${invoiceData?.shipmentDetails?.grossWt} KGS`,
                          ],
                          fontSize: 10,
                          alignment: `left`,
                        },
                      ],
                      width: "40%",
                    },
                  ],
                },
                {
                  columns: [
                    {
                      stack: [
                        {
                          text: [
                            { text: `Chargeable Wt : `, bold: true },
                            `${invoiceData?.shipmentDetails?.chargeableWt} KGS`,
                          ],
                          fontSize: 10,
                          alignment: `left`,
                        },
                      ],
                      width: "60%",
                    },
                    {
                      stack: [
                        {
                          text: ``,
                          fontSize: 10,
                          alignment: `left`,
                        },
                      ],
                      width: "40%",
                    },
                  ],
                },
                {
                  columns: [
                    {
                      stack: [
                        {
                          text: [
                            { text: `Net Weight : `, bold: true },
                            `0.000 KGS`,
                          ],
                          fontSize: 10,
                          alignment: `left`,
                        },
                      ],
                      width: "60%",
                    },
                    {
                      stack: [{}],
                      width: "40%",
                    },
                  ],
                },
                {
                  columns: [
                    {
                      stack: [
                        {
                          text: [
                            { text: `Flight No. : `, bold: true },
                            `${invoiceData?.shipmentDetails?.flightNo}`,
                          ],
                          fontSize: 10,
                          alignment: `left`,
                        },
                      ],
                      width: "60%",
                    },
                    {
                      stack: [
                        {
                          text: [
                            { text: `Date : `, bold: true },
                            `${
                              invoiceData?.shipmentDetails?.departureDate
                                ? moment(
                                    invoiceData?.shipmentDetails?.departureDate
                                  ).format("DD-MMM-YYYY")
                                : ""
                            }`,
                          ],
                          fontSize: 10,
                          alignment: `left`,
                        },
                      ],
                      width: "40%",
                    },
                  ],
                },
                {
                  columns: [
                    {
                      stack: [
                        {
                          text: [
                            { text: `Airline : `, bold: true },
                            `${invoiceData?.shipmentDetails?.airlines}`,
                          ],
                          fontSize: 10,
                          alignment: `left`,
                        },
                      ],
                      width: "60%",
                    },
                    {
                      stack: [{}],
                      width: "40%",
                    },
                  ],
                },
              ],
            },
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {
              colSpan: 6,
              stack: [
                // {
                //   text: [{ text: `Shipper Ref. : `, bold: true }, ``],
                //   fontSize: 10,
                //   alignment: `left`,
                // },
                // {
                //   text: [{ text: `IncoTerms : `, bold: true }, ``],
                //   fontSize: 10,
                //   alignment: `left`,
                // },
                // {
                //   text: [
                //     { text: `Shipper : `, bold: true },
                //     `${invoiceData?.shipmentDetails?.shipperName ? invoiceData?.shipmentDetails?.shipperName: ''}`,
                //   ],
                //   fontSize: 10,
                //   alignment: `left`,
                // },
                // {
                //   text: [
                //     { text: `Consignee : `, bold: true },
                //     `${invoiceData?.shipmentDetails?.consigneeName ? invoiceData?.shipmentDetails?.consigneeName : ''}`,
                //   ],
                //   fontSize: 10,
                //   alignment: `left`,
                // },
                // {
                //   text: [{ text: `Place of Receipt : `, bold: true }, ``],
                //   fontSize: 10,
                //   alignment: `left`,
                // },
                {
                  text: [
                    { text: `Loading Port : `, bold: true },
                    `${invoiceData?.shipmentDetails?.loadingPortName}`,
                  ],
                  fontSize: 10,
                  alignment: `left`,
                },
                // {
                //   text: [{ text: `Discharge Port : `, bold: true }, ``],
                //   fontSize: 10,
                //   alignment: `left`,
                // },
                {
                  text: [{ text: `Place of Delivery : `, bold: true }, ``],
                  fontSize: 10,
                  alignment: `left`,
                },
                {
                  text: [
                    { text: `Destination Port : `, bold: true },
                    `${invoiceData?.shipmentDetails?.destinationPortName} (${invoiceData?.shipmentDetails?.portCode})`,
                  ],
                  fontSize: 10,
                  alignment: `left`,
                },
                {
                  text: [
                    { text: `CD No.: `, bold: true },
                    `${
                      invoiceData?.shipmentDetails?.dispatchDocNo
                        ? invoiceData?.shipmentDetails?.dispatchDocNo
                        : "-"
                    }`,
                  ],
                  fontSize: 10,
                  alignment: `left`,
                },
              ],
            },
            {},
            {},
            {},
            {},
            {},
          ],
          [
            {
              text: "Sr No",
              alignment: `center`,
              fontSize: 8,
              bold: true,
              rowSpan: 2,
            },
            {
              text: "Description",
              alignment: `center`,
              fontSize: 8,
              bold: true,
              rowSpan: 2,
            },
            {
              text: "HSN/SAC",
              alignment: `center`,
              fontSize: 8,
              bold: true,
              rowSpan: 2,
            },
            {
              text: "Curr",
              alignment: `center`,
              fontSize: 8,
              bold: true,
              rowSpan: 2,
            },
            {
              text: "Quantity",
              alignment: `center`,
              fontSize: 8,
              bold: true,
              rowSpan: 2,
            },
            {
              text: "Rate",
              alignment: `center`,
              fontSize: 8,
              bold: true,
              rowSpan: 2,
            },
            {
              text: "Amount (Cur)",
              alignment: `center`,
              fontSize: 8,
              bold: true,
              rowSpan: 2,
            },
            // {
            //   text: "Ex. Rate",
            //   alignment: `center`,
            //   fontSize: 8,
            //   bold: true,
            //   rowSpan: 2,
            // },
            // {
            //   text: "Tax Type",
            //   alignment: `center`,
            //   fontSize: 8,
            //   bold: true,
            //   rowSpan: 2,
            // },
            {
              text: "Non GST Exempt Value (INR)",
              alignment: `center`,
              fontSize: 8,
              bold: true,
              rowSpan: 2,
            },
            {
              text: "Taxable Value (INR)",
              alignment: `center`,
              fontSize: 8,
              bold: true,
              rowSpan: 2,
            },
            {
              // text: `${
              //   invoiceData?.companyDetails?.customerBranch?.name ==
              //   "Maharashtra"
              //     ? "CGST + SGST"
              //     : "IGST"
              // }`,
              text: `GST`,
              alignment: `center`,
              fontSize: 8,
              bold: true,
              colSpan: 4,
            },
            {},
            {},
            {},
            {
              text: "Total (INR)",
              alignment: `center`,
              fontSize: 8,
              bold: true,
              rowSpan: 2,
            },
          ],
          [
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            // {},
            // {},
            { text: `CGST`, alignment: `center`, fontSize: 8, bold: true },
            { text: `SGST`, alignment: `center`, fontSize: 8, bold: true },
            { text: `IGST`, alignment: `center`, fontSize: 8, bold: true },
            { text: `Amount`, alignment: `center`, fontSize: 8, bold: true },
            {},
          ],
        ]
          .concat(
            // Cost Items
            invoiceData?.rateDetails?.invoiceItems.map((item: any, index) => {
              const gstRateValue =
                invoiceData?.companyDetails?.customer?.stateName ==
                invoiceData?.companyDetails?.organization?.stateName
                  ? Number(invoiceData?.rateDetails?.sgstRate) +
                    Number(invoiceData?.rateDetails?.cgstRate)
                  : Number(invoiceData?.rateDetails?.igstRate);
              console.log(gstRateValue);
              const igstRateValue = gstRateValue / 100;
              const igstAmt =
                (Number(item?.quantity) *
                  Number(item?.rate) *
                  Number(igstRateValue) *
                  100) /
                100;
              const totItemVal =
                Number(item?.quantity) * Number(item?.rate) + Number(igstAmt);
              this.totalItemValue += totItemVal;
              return [
                { text: `${index + 1}`, fontSize: 8 },
                { text: item?.serviceName, fontSize: 8 },
                { text: item?.hsnCode, fontSize: 8 },
                { text: "INR", fontSize: 8 },
                {
                  text: `${this.numberFormat(Number(item?.quantity))} ${
                    item?.unit
                  }`,
                  alignment: `right`,
                  fontSize: 8,
                },
                {
                  text: this.numberFormat(Number(item?.rate)),
                  alignment: `right`,
                  fontSize: 8,
                },
                {
                  text: this.numberFormat(
                    Number(item?.quantity) * Number(item?.rate)
                  ),
                  fontSize: 8,
                },
                // { text: `1.00`, fontSize: 8 },
                // { text: `T`, fontSize: 8, alignment: `center` },
                { text: ``, fontSize: 8 },
                {
                  text: this.numberFormat(
                    Number(item?.quantity) * Number(item?.rate)
                  ),
                  fontSize: 8,
                  alignment: `right`,
                },
                {
                  text:
                    this.numberFormat(
                      Number(invoiceData?.rateDetails?.cgstRate)
                    ) + ".00",
                  fontSize: 8,
                  alignment: `right`,
                },
                {
                  text:
                    this.numberFormat(
                      Number(invoiceData?.rateDetails?.cgstRate)
                    ) + ".00",
                  fontSize: 8,
                  alignment: `right`,
                },
                {
                  text: this.numberFormat(
                    Number(invoiceData?.rateDetails?.igstRate)
                  ),
                  fontSize: 8,
                  alignment: `right`,
                },
                {
                  text: this.numberFormat(igstAmt),
                  fontSize: 8,
                  alignment: `right`,
                },
                {
                  text: this.numberFormat(totItemVal),
                  alignment: `right`,
                  fontSize: 8,
                },
              ];
            }) as any
          )
          .concat(
            // Cost Items Total
            [
              [
                {
                  text: `T: Taxable P:Pure Agent E:Exemption R:Reverse Charge N:Non Taxable`,
                  alignment: `left`,
                  fontSize: 7,
                  bold: true,
                  colSpan: 6,
                  margin: [0, 1.5, 0, 0],
                },
                {},
                {},
                {},
                {},
                {},
                // {},
                {
                  text: `Sub Total`,
                  alignment: `right`,
                  fontSize: 8,
                  bold: true,
                  colSpan: 2,
                },
                // {
                //   text: ``,
                //   alignment: `center`,
                //   fontSize: 8,
                //   bold: true,
                //   colSpan: 2,
                // },
                {},
                {
                  text: this.numberFormat(
                    this.calculateTaxableAmount(
                      invoiceData?.rateDetails?.invoiceItems
                    )
                  ),
                  alignment: `right`,
                  fontSize: 7,
                  bold: true,
                },
                {
                  text: this.numberFormat(
                    this.calculateGSTAmount(
                      invoiceData?.rateDetails?.invoiceItems,
                      invoiceData
                    )
                  ),
                  alignment: `right`,
                  fontSize: 7,
                  bold: true,
                  colSpan: 4,
                },
                {},
                {},
                {},
                {
                  text: this.numberFormat(
                    Number(invoiceData?.rateDetails?.totalAmount)
                  ),
                  alignment: `right`,
                  fontSize: 7,
                  bold: true,
                },
              ],
            ] as any
          )
          .concat([
            [
              {
                colSpan: 8,
                stack: [
                  {
                    columns: [
                      {
                        stack: [
                          {
                            text: `Payment Details : `,
                            fontSize: 10,
                            alignment: `left`,
                            bold: true,
                          },
                          {
                            text: `Bank Name : ${invoiceData?.bankDetails?.name}`,
                            fontSize: 10,
                            alignment: `left`,
                          },
                          {
                            text: `Branch Name : ${invoiceData?.bankDetails?.branchName}`,
                            fontSize: 10,
                            alignment: `left`,
                          },
                          {
                            text: `A/c No : ${invoiceData?.bankDetails?.accountNumber}`,
                            fontSize: 10,
                            alignment: `left`,
                          },
                          {
                            text: `IFSC : ${invoiceData?.bankDetails?.ifscCode}`,
                            fontSize: 10,
                            alignment: `left`,
                          },
                          {
                            text: `Swift Code : ${invoiceData?.bankDetails?.swiftCode}`,
                            fontSize: 10,
                            alignment: `left`,
                          },
                          {
                            text: ``,
                            fontSize: 10,
                            alignment: `left`,
                          },
                          // {
                          //   text: [
                          //     { text: `IRN : `, bold: true },
                          //     {text :`${invoiceData?.irn}`, fontSize: 7.5},
                          //   //   `${invoiceData?.irn}`,
                          //   ],
                          //   fontSize: 10,
                          //   alignment: `left`,
                          // },
                        ],
                        width: "100%",
                      },
                      {
                        stack: [
                          {
                            text: ``,
                            fontSize: 10,
                            alignment: `left`,
                          },
                        ],
                        width: "0%",
                      },
                    ],
                  },
                ],
              },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {
                colSpan: 6,
                stack: [
                  {
                    columns: [
                      {
                        stack: [
                          {
                            text: `Total Amount Before Tax`,
                            fontSize: 10,
                            alignment: `left`,
                            bold: true,
                          },
                        ],
                        width: "60%",
                      },
                      {
                        stack: [
                          {
                            text: `INR`,
                            fontSize: 10,
                            alignment: `center`,
                            bold: true,
                          },
                        ],
                        width: "10%",
                      },
                      {
                        stack: [
                          {
                            text: this.numberFormat(
                              this.calculateTaxableAmount(
                                invoiceData?.rateDetails?.invoiceItems
                              )
                            ),
                            fontSize: 10,
                            alignment: `right`,
                          },
                        ],
                        width: "30%",
                      },
                    ],
                  },
                  {
                    columns: [
                      {
                        stack: [
                          {
                            text: `Add : GST`,
                            fontSize: 10,
                            alignment: `left`,
                            bold: true,
                          },
                        ],
                        width: "60%",
                      },
                      {
                        stack: [
                          {
                            text: `INR`,
                            fontSize: 10,
                            alignment: `center`,
                            bold: true,
                          },
                        ],
                        width: "10%",
                      },
                      {
                        stack: [
                          {
                            text: this.numberFormat(
                              this.calculateGSTAmount(
                                invoiceData?.rateDetails?.invoiceItems,
                                invoiceData
                              )
                            ),
                            fontSize: 10,
                            alignment: `right`,
                          },
                        ],
                        width: "30%",
                      },
                    ],
                  },
                  {
                    columns: [
                      {
                        stack: [
                          {
                            text: `Total Invoice Value`,
                            fontSize: 10,
                            alignment: `left`,
                            bold: true,
                          },
                        ],
                        width: "60%",
                      },
                      {
                        stack: [
                          {
                            text: `INR`,
                            fontSize: 10,
                            alignment: `center`,
                            bold: true,
                          },
                        ],
                        width: "10%",
                      },
                      {
                        stack: [
                          {
                            text: this.numberFormat(
                              Number(invoiceData?.rateDetails?.totalAmount)
                            ),
                            fontSize: 10,
                            alignment: `right`,
                          },
                        ],
                        width: "30%",
                      },
                    ],
                  },
                  {
                    columns: [
                      {
                        stack: [
                          {
                            text: `Less : Advance Received`,
                            fontSize: 10,
                            alignment: `left`,
                            bold: true,
                          },
                        ],
                        width: "60%",
                      },
                      {
                        stack: [
                          {
                            text: `INR`,
                            fontSize: 10,
                            alignment: `center`,
                            bold: true,
                          },
                        ],
                        width: "10%",
                      },
                      {
                        stack: [
                          {
                            text: `0.00`,
                            fontSize: 10,
                            alignment: `right`,
                          },
                        ],
                        width: "30%",
                      },
                    ],
                  },
                  {
                    columns: [
                      {
                        stack: [
                          {
                            text: `Round-Off`,
                            fontSize: 10,
                            alignment: `left`,
                            bold: true,
                          },
                        ],
                        width: "60%",
                      },
                      {
                        stack: [
                          {
                            text: `INR`,
                            fontSize: 10,
                            alignment: `center`,
                            bold: true,
                          },
                        ],
                        width: "10%",
                      },
                      {
                        stack: [
                          {
                            text: `(${(
                              Math.ceil(
                                Number(invoiceData?.rateDetails?.taxableAmount)
                              ) -
                              Number(invoiceData?.rateDetails?.taxableAmount)
                            ).toFixed(2)})`,
                            fontSize: 10,
                            alignment: `right`,
                          },
                        ],
                        width: "30%",
                      },
                    ],
                  },
                  {
                    columns: [
                      {
                        stack: [
                          {
                            text: `Net Payable`,
                            fontSize: 10,
                            alignment: `left`,
                            bold: true,
                          },
                        ],
                        width: "60%",
                      },
                      {
                        stack: [
                          {
                            text: `INR`,
                            fontSize: 10,
                            alignment: `center`,
                            bold: true,
                          },
                        ],
                        width: "10%",
                      },
                      {
                        stack: [
                          {
                            text: this.numberFormat(
                              Number(invoiceData?.rateDetails?.totalAmount)
                            ),
                            fontSize: 10,
                            alignment: `right`,
                          },
                        ],
                        width: "30%",
                      },
                    ],
                  },
                  {
                    columns: [
                      {
                        stack: [
                          {
                            text: `Tax Payable on Reverse Charges`,
                            fontSize: 10,
                            alignment: `left`,
                            bold: true,
                          },
                        ],
                        width: "60%",
                      },
                      {
                        stack: [
                          {
                            text: `INR`,
                            fontSize: 10,
                            alignment: `center`,
                            bold: true,
                          },
                        ],
                        width: "10%",
                      },
                      {
                        stack: [
                          {
                            text: `0.00`,
                            fontSize: 10,
                            alignment: `right`,
                          },
                        ],
                        width: "30%",
                      },
                    ],
                  },
                ],
              },
              {},
              {},
              {},
              {},
              {},
            ],
          ] as any)
          .concat([
            [
              {
                colSpan: 14,
                stack: [
                  {
                    text: [
                      { text: `Net Payable In Words (INR) : `, bold: true },
                      `${invoiceData?.rateDetails?.amountInWords}Only.`,
                    ],
                    fontSize: 10,
                    alignment: `left`,
                  },
                ],
              },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
            ],
          ] as any)
          .concat([
            [
              {
                colSpan: 14,
                stack: [
                  {
                    text: `Remark : `,
                    fontSize: 10,
                    alignment: `left`,
                    bold: true,
                  },
                ],
              },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
            ],
          ] as any)
          .concat([
            [
              {
                colSpan: 14,
                stack: [
                  {
                    columns: [
                      {
                        stack: [
                          {
                            text: `Terms & Conditions :`,
                            fontSize: 10,
                            alignment: `left`,
                            bold: true,
                          },
                          // {
                          //   text: `Dear Customer, We would request please check your GST No and address and any other discrepancies in the invoice properly and in case of error please escalate to us for corrective action within  hours of the receipt of invoice, we shall not be responsible for any error and no request for change can be entertained if we do not receive the same in 24 hours of the receipt of invoice.`,
                          //   fontSize: 10,
                          //   alignment: `left`,
                          // },
                          {
                            text: `* In case of any discrepancies in the invoice, please bring them to our attention within three days of receipt of an invoice; else, the same would be treated as correct.`,
                            fontSize: 10,
                            alignment: `left`,
                          },
                          {
                            text: `* Delay in payment/settlement beyond the agreed credit period will attract an interest penalty of @24% annually.`,
                            fontSize: 10,
                            alignment: `left`,
                          },
                          {
                            text: `* Government taxes apply as per the prevailing rates.`,
                            fontSize: 10,
                            alignment: `left`,
                          },

                          {
                            text: `* This is a system-generated invoice; hence it does not require any signature.`,
                            fontSize: 10,
                            alignment: `left`,
                          },
                          {
                            text: `* All disputes are subject to the jurisdiction of the court in ${invoiceData?.companyDetails?.organizationBranch?.name}.`,
                            fontSize: 10,
                            alignment: `left`,
                          },
                          {
                            text: `E & O.E`,
                            fontSize: 10,
                            alignment: `left`,
                            bold: true,
                            margin: [0, 29, 0, 0],
                          },
                        ],
                        width: "70%",
                      },
                      {
                        stack: [
                          {
                            text: `For ${invoiceData?.companyDetails?.organization?.name}`,
                            fontSize: 10,
                            alignment: `right`,
                            bold: true,
                          },
                          {
                            image: this.stampBase64,
                            width: 100,
                            height: 100,
                            alignment: `right`,
                            // margin: [0, 5, 0, 0],
                          },
                          {
                            text: `Authorised Signatory`,
                            fontSize: 10,
                            alignment: `right`,
                            bold: true,
                            // margin: [0, 5, 0, 0],
                          },
                        ],
                        width: "30%",
                      },
                    ],
                  },
                ],
              },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
            ],
          ] as any),
        // Table Body Ends
      },
      fontSize: 10,
      //   layout: {
      //     hLineWidth: function (i: 0, node: any) {
      //       if (i === 0 || i === 1 || i == 2) {
      //         return 1;
      //       } else if (i == invoiceData?.rateDetails?.invoiceItems.length + 2)
      //         return 1;
      //       else if (i <= invoiceData?.rateDetails?.invoiceItems.length + 4)
      //         return 0;
      //       return 1;
      //     },
      //   },
    };
    const stack = {
      stack: [table],
      margin: [10, 0, 10, 0],
    };
    return stack;
  }

  //   private createHSNTable(invoiceData: any) {
  //     const table = {
  //       table: {
  //         widths: ["*", 60, 40, 50, 70],
  //         body: [
  //           // Header
  //           [
  //             { text: `HSN/SAC`, alignment: `center`, rowSpan: 2 },
  //             { text: `Taxable Value`, alignment: `center`, rowSpan: 2 },
  //             { text: `Integrated Tax`, alignment: `center`, colSpan: 2 },
  //             {},
  //             { text: `Total Tax Amount`, alignment: `center`, rowSpan: 2 },
  //           ],
  //           [
  //             {},
  //             {},
  //             { text: `Rate`, alignment: `center` },
  //             { text: `Amount`, alignment: `center` },
  //             {},
  //           ],
  //         ]
  //           .concat(
  //             invoiceData?.hsnCodeItems?.map((row: any) => {
  //               return [
  //                 { text: row?.hsnCode },
  //                 {
  //                   text: this.numberFormat(Number(row?.amount)),
  //                   alignment: `right`,
  //                 },
  //                 {
  //                   text: `${invoiceData?.rateDetails?.igstRate}%`,
  //                   alignment: `right`,
  //                 },
  //                 {
  //                   text: this.numberFormat(Number(row?.taxableAmount)),
  //                   alignment: `right`,
  //                 },
  //                 {
  //                   text: this.numberFormat(Number(row?.taxableAmount)),
  //                   alignment: `right`,
  //                 },
  //               ];
  //             })
  //           )
  //           .concat([
  //             [
  //               { text: `Total`, bold: true, alignment: `right` },
  //               {
  //                 text: this.numberFormat(
  //                   Number(invoiceData?.hsnListTaxableTotalValue)
  //                 ),
  //                 bold: true,
  //                 alignment: `right`,
  //               },
  //               {},
  //               {
  //                 text: this.numberFormat(
  //                   Number(invoiceData?.hsnListTaxableTotalAmount)
  //                 ),
  //                 bold: true,
  //                 alignment: `right`,
  //               },
  //               {
  //                 text: this.numberFormat(
  //                   Number(invoiceData?.hsnListTaxableTotalAmount)
  //                 ),
  //                 bold: true,
  //                 alignment: `right`,
  //               },
  //             ],
  //           ] as any),
  //       },
  //       fontSize: 10,
  //     };
  //     const stack = {
  //       stack: [
  //         table,
  //         {
  //           columns: [
  //             { text: `Tax Amount (in Words) :`, fontSize: 10, width: `auto` },
  //             {
  //               text: `INR ${invoiceData?.hsnTotalValueInWords}`,
  //               fontSize: 12,
  //               bold: true,
  //               width: `*`,
  //               margin: [1, 0, 0, 0],
  //             },
  //           ],
  //           margin: [0, 5, 0, 0],
  //         },
  //       ],
  //       margin: [10, 5, 10, 5],
  //     };
  //     return stack;
  //   }

  //   private createRemark(invoiceData: any) {
  //     const template = {
  //       columns: [
  //         {
  //           width: `50%`,
  //           stack: [
  //             { text: `Remark: `, italics: true },
  //             { text: `Packages : ${invoiceData?.shipmentDetails?.packageQty}` },
  //           ],
  //         },
  //         {
  //           stack: [
  //             { text: `Company Bank Details: `, italics: true },
  //             {
  //               text: `A/c Holder's Name : ${invoiceData?.companyDetails?.organization?.name}`,
  //             },
  //             { text: `Bank Name : ${invoiceData?.bankDetails?.name}` },
  //             { text: `A/c No. : ${invoiceData?.bankDetails?.accountNumber}` },
  //             {
  //               text: `Branch & IFS Code : ${invoiceData?.bankDetails?.branchName} Branch & ${invoiceData?.bankDetails?.ifscCode}`,
  //             },
  //             {
  //               text: `for ${invoiceData?.companyDetails?.organization?.name}`,
  //               bold: true,
  //               alignment: `center`,
  //             },
  //           ],
  //           width: `50%`,
  //         },
  //       ],
  //       fontSize: 10,
  //       margin: [10, 0, 10, 0],
  //     };
  //     return template;
  //   }

  //   private createDeclaration(invoiceData: any) {
  //     const template = {
  //       stack: [
  //         {
  //           columns: [
  //             {
  //               stack: [
  //                 { text: `Declaration`, decoration: `underline` },
  //                 {
  //                   alignment: `justify`,
  //                   text: `We declare that this invoice shows the actual price described and that all particulars are true and correct
  //                                 DISCLAIMER: Dear Customer, We would request please check your GST No and address properly and in case of error please escalate to us for corrective action within 48 hours of the receipt of invoice, we shall not be responsbile for any error and no request for change will be entertained after 48hours of receipt of the invoice.`,
  //                 },
  //               ],
  //               width: `50%`,
  //             },
  //             {},
  //           ],
  //           fontSize: 8,
  //         },
  //         {
  //           text: `Authorised Signatory`,
  //           alignment: `right`,
  //           fontSize: 10,
  //         },
  //         {
  //           text: `This is a Computer Generated Invoice`,
  //           alignment: `center`,
  //           decoration: `underline`,
  //           fontSize: 10,
  //         },
  //       ],
  //       margin: [10, 20, 10, 0],
  //     };
  //     return template;
  //   }

  // Utils

  private numberFormat(data: number) {
    if (data > 10)
      return data
        ?.toFixed(2)
        ?.toString()
        ?.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, `,`);
    else
      return data?.toString()?.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, `,`);
  }

  calculateTaxableAmount(array) {
    const initialValue = 0;
    const sumWithInitial = array.reduce(
      (accumulator, currentValue) =>
        accumulator + Number(currentValue.quantity) * Number(currentValue.rate),
      initialValue
    );
    return sumWithInitial;
  }

  calculateGSTAmount(array, invoiceData?: any) {
    const organizationStateName =
      invoiceData?.companyDetails?.organization?.stateName;
    const customerStateName = invoiceData?.companyDetails?.customer?.stateName;
    const gstRate =
      organizationStateName == customerStateName
        ? Number(invoiceData?.rateDetails?.cgstRate) +
          Number(invoiceData?.rateDetails?.sgstRate)
        : Number(invoiceData?.rateDetails?.igstRate);
    const gstRateValue = gstRate / 100;
    console.log({
      invoiceData,
      organizationStateName,
      customerStateName,
      gstRateValue,
      gstRate,
    });
    const initialValue = 0;
    const sumWithInitial = array.reduce(
      (accumulator, currentValue) =>
        accumulator +
        (Number(currentValue?.quantity) *
          Number(currentValue?.rate) *
          Number(gstRateValue) *
          100) /
          100,
      initialValue
    );
    this.gstTotalAmt = sumWithInitial;
    return sumWithInitial;
  }
}
