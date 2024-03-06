import { CurrencyPipe, DecimalPipe } from "@angular/common";
import * as _ from "lodash";
import * as moment from "moment";
// import moment from 'moment';
import * as pdf from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import {
  ExchangeItem,
  SaleDetails,
  SaleItem,
} from "src/app/modules/sale/model/sale.model";
import { convertAmountToWords } from "../utils/convert-amount-to-words";
import { IndianCurrencyPipe } from "../pipes/indian-currency-pipe";
const pdfMake = pdf;
pdfMake.vfs = pdfFonts.pdfMake.vfs;

interface invoiceDataModel {
  customer: any;
  place: any;
  saleDetails: SaleDetails;
  listItems: SaleItem[];
  exchangeListItems: ExchangeItem[];
}

export class InvoicePDF {
  dummyLogo: string =
    "data:image/png;base64,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";
  private bindingData: invoiceDataModel;
  private documentDefinition: any;
  constructor(bindingData: invoiceDataModel) {
    this.bindingData = bindingData;
    this.documentDefinition = this.getDocumentDefinition();
  }

  downloadPdf(fileName: string) {
    pdfMake
      .createPdf(this.documentDefinition)
      .download(fileName ? fileName : `PDF_` + fileName);
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
      header: (currentPage, pageCount, pageSize) => {
        return this.headerBG();
      },
      footer: (currentPage, pageCount) => {
        return this.footerBG();
      },
      content: [
        this.createrInvoiceTitleStrip(),
        this.createOrgAndInvoiceInfo(this.bindingData),
        this.createInvoiceTable(this.bindingData),
        // this.taxInvoiceDetails(this.bindingData.invoiceData),
        // this.createInvoiceTable(this.bindingData.invoiceData),
        // this.createHSNTable(this.bindingData.invoiceData),
        this.createRemark(this.bindingData),
        this.createDeclaration(),
      ],
      styles: [],
      pageMargins: [0, 20, 0, 20],
    };
  }

  private headerBG() {
    const bgColor = "#f7f3d0";
    const borders = [false, false, false, false];
    const template = {
      table: {
        widths: ["*"],
        body: [
          [
            {
              border: borders,
              fillColor: bgColor,
              text: "",
            },
          ],
          [
            {
              border: borders,
              fillColor: bgColor,
              text: "",
            },
          ],
          [
            {
              border: borders,
              fillColor: bgColor,
              text: "",
            },
          ],
        ],
      },
    };
    return template;
  }

  private footerBG() {
    const bgColor = "#f7f3d0";
    const borders = [false, false, false, false];
    const template = {
      table: {
        widths: ["*", 200],
        body: [
          [
            {
              border: borders,
              fillColor: bgColor,
              text: "",
            },
            {
              border: borders,
              fillColor: "#fff",
              text: "",
            },
          ],
          [
            {
              border: borders,
              fillColor: bgColor,
              text: "",
            },
            {
              border: borders,
              fillColor: "#fff",
              text: "",
            },
          ],
          [
            {
              border: borders,
              fillColor: bgColor,
              text: "",
            },
            {
              border: borders,
              fillColor: "#fff",
              text: "",
            },
          ],
        ],
      },
    };
    return template;
  }

  private createrInvoiceTitleStrip() {
    const template = {
      columns: [
        {
          width: "*",
          fontSize: 40,
          text: "PROFORMA",
          decoration: "overline",
          decorationColor: "#f7f3d0",
        },
        {
          stack: [
            {
              image: this.dummyLogo,
              width: 50,
              height: 50,
            },
          ],
          width: 50,
        },
      ],
      columnGap: 10,
      margin: [20, 10, 20, 0],
    };
    return template;
  }

  private createOrgAndInvoiceInfo(invoiceData: invoiceDataModel) {
    const highlightColor = "#640e27";
    const template = {
      columns: [
        {
          stack: [
            {
              text: "M/s Wish Wheels",
              bold: true,
              fontSize: 10,
              color: "191919",
            },
            {
              text: "Emerene Heights,",
            },
            {
              text: "Convent Avenue, Willingdon,",
            },
            {
              text: "Santacruz West, Mumbai - 400054.",
            },
            {
              text: "GSTIN/UIN: 27DBFPK7810F3ZN",
            },
            {
              text: "State: Maharashtra, Code: 47",
            },
          ],
          fontSize: 8,
          color: "#5c5c5c",
          width: "50%",
          margin: [0, 70, 0, 0],
        },
        {
          stack: [
            {
              layout: "noBorders",
              table: {
                widths: ["*", 120],
                body: [
                  [
                    {
                      text: "Proforma#:",
                      color: highlightColor,
                      alignment: "right",
                    },
                    {
                      text: invoiceData.saleDetails?.invoiceNo
                        ? invoiceData.saleDetails?.invoiceNo
                        : "-",
                      alignment: "right",
                    },
                  ],
                  [
                    {
                      text: "Proforma Date:",
                      color: highlightColor,
                      alignment: "right",
                    },
                    {
                      text: invoiceData.saleDetails?.invoiceDate
                        ? moment(invoiceData.saleDetails?.invoiceDate).format(
                            "DD MMM, YYYY"
                          )
                        : "-",
                      alignment: "right",
                    },
                  ],
                ],
              },
            },
            {
              stack: [
                {
                  text: "Bill To: (Buyer):",
                  alignment: "right",
                  color: highlightColor,
                  fontSize: 8,
                  margin: [0, 10, 0, 5],
                },
                {
                  text: invoiceData?.customer?.companyName
                    ? invoiceData?.customer?.companyName
                    : invoiceData?.customer?.firstName
                    ? `${invoiceData?.customer?.firstName} ${invoiceData?.customer?.middleName} ${invoiceData?.customer?.lastName}`
                    : "-",
                  bold: true,
                  fontSize: 10,
                  color: "191919",
                },
                {
                  text: invoiceData?.customer?.addressLine1
                    ? invoiceData?.customer?.addressLine1
                    : "-",
                },
                {
                  text: invoiceData?.customer?.addressLine2
                    ? invoiceData?.customer?.addressLine2
                    : "-",
                },
                {
                  text: invoiceData?.customer?.city
                    ? `${invoiceData?.customer?.city} - ${invoiceData?.customer?.pincode}`
                    : "-",
                },
                {
                  text: `PAN: ${
                    invoiceData?.customer?.pan
                      ? invoiceData?.customer?.pan
                      : "-"
                  }`,
                },
                {
                  text: `GST: ${invoiceData?.customer?.gst || "N/A"}`,
                },
                {
                  text: `PHONE: ${
                    invoiceData?.customer?.mobileNo
                      ? invoiceData?.customer?.mobileNo
                      : "-"
                  }`,
                },
              ],
              fontSize: 8,
              color: "#5c5c5c",
              alignment: "right",
              margin: [0, 10, 0, 0],
            },
          ],
          width: "50%",
        },
      ],
      columnGap: 10,
      margin: [20, 20, 20, 10],
    };
    return template;
  }

  private createInvoiceTable(invoiceData: invoiceDataModel) {
    const bgColor = "#f4f4f4";
    const headerColor = "#640e27";
    const totalAmount = invoiceData.listItems.reduce(
      (total, item) => total + Number(item.rate) * item.qty,
      0
    );
    const totalExchangeAmount = invoiceData.exchangeListItems.reduce(
      (total, item) => total + Number(item.rate) * item.qty,
      0
    );
    const calculatedSubTotalAmount =
      Number(totalAmount) - Number(totalExchangeAmount);
    const tcs1Perc = (calculatedSubTotalAmount / 100) * 1;
    const template = {
      table: {
        widths: ["auto", "*", 50, 25, "auto", 20, "auto"],
        body: [
          [
            {
              text: "#",
              color: headerColor,
            },
            {
              text: "Description / Item",
              color: headerColor,
            },
            {
              text: "HSN/SAC",
              color: headerColor,
            },
            {
              text: "Qty.",
              color: headerColor,
            },
            {
              text: "Rate",
              color: headerColor,
              alignment: "right",
            },
            {
              text: "Per",
              color: headerColor,
            },
            {
              text: "Amount",
              color: headerColor,
              bold: true,
              alignment: "right",
            },
          ],
        ]
          .concat(
            // Sale List Items
            invoiceData.listItems.map<any>((item, index) => {
              return [
                {
                  text: index + 1,
                },
                {
                  stack: [
                    {
                      text:
                        item?.carDetails?.name ||
                        item?.carDetails?.Car_Detail?.name,
                      bold: true,
                      fontSize: 10,
                      margin: [0, 0, 0, 5],
                    },
                    {
                      table: {
                        body: [
                          [
                            {
                              text: "Vehicle No:",
                            },
                            {
                              text:
                                item?.carDetails?.Car_Detail?.vehicleNo ||
                                "MH 12 RK 7128",
                            },
                          ],
                          [
                            {
                              text: "Engine:",
                            },
                            {
                              text:
                                item?.carDetails?.Car_Detail?.engineNo ||
                                "210419Y0446PT204",
                            },
                          ],
                          [
                            {
                              text: "VIN:",
                            },
                            {
                              text:
                                item?.carDetails?.Car_Detail?.vinNo ||
                                "SALWA2AX8NA797820",
                            },
                          ],
                          [
                            {
                              text: "Year:",
                            },
                            {
                              text: item.carDetails?.Car_Detail?.year,
                            },
                          ],
                          [
                            {
                              text: "Owner:",
                            },
                            {
                              text: item.carDetails?.Car_Detail?.ownerShip,
                            },
                          ],
                          [
                            {
                              text: "Color:",
                            },
                            {
                              text: item.carDetails?.Car_Detail?.color,
                            },
                          ],
                        ],
                      },
                      fontSize: 8,
                      margin: [0, 0, 0, 10],
                      layout: "noBorders",
                    },
                  ],
                },
                {
                  text: "998313",
                },
                {
                  text: item.qty,
                },
                {
                  // text: new DecimalPipe("en-IN").transform(item.rate, '.2')
                  text: new IndianCurrencyPipe().transform(Number(item.rate)),
                },
                {
                  text: "QTY",
                },
                {
                  // text: new CurrencyPipe("en-IN").transform(Number(item.rate) * item.qty, "INR"),
                  text: new IndianCurrencyPipe().transform(
                    Number(item.rate) * item.qty
                  ),
                  alignment: "right",
                },
              ];
            }),
            // Exchange List Items
            invoiceData.exchangeListItems.map<any>((item, index) => {
              return [
                {
                  // BY DEFAULT ONLY 1 ITEM SOLD
                  text: index + 2,
                },
                {
                  stack: [
                    {
                      // Car Title
                      text: `${item?.title} (exchange)`,
                      bold: true,
                      fontSize: 10,
                      margin: [0, 0, 0, 5],
                    },
                    {
                      table: {
                        body: [
                          [
                            {
                              text: "Vehicle No:",
                            },
                            {
                              text: item?.carNo,
                            },
                          ],
                          [
                            {
                              text: "Year:",
                            },
                            {
                              text: item?.year,
                            },
                          ],
                        ],
                      },
                      fontSize: 8,
                      margin: [0, 0, 0, 10],
                      layout: "noBorders",
                    },
                  ],
                },
                {
                  text: "998313",
                },
                {
                  text: item.qty,
                },
                {
                  // text: new DecimalPipe("en-IN").transform(item.rate, '.2')
                  text: new IndianCurrencyPipe().transform(Number(item.rate)),
                },
                {
                  text: "QTY",
                },
                {
                  // text: new CurrencyPipe("en-IN").transform(Number(item.rate) * item.qty, "INR"),
                  text: `- ${new IndianCurrencyPipe().transform(
                    Number(item.rate) * item.qty
                  )}`,
                  alignment: "right",
                },
              ];
            })
          )
          .concat([
            [
              {
                colSpan: 6,
                stack: [
                  {
                    fontSize: 6,
                    text: "(inc. of GST)",
                    margin: [0, 0, 0, 5],
                  },
                  {
                    fontSize: 8,
                    text: "TCS (1%)",
                    margin: [0, 0, 0, 5],
                  },
                  "Subtotal",
                ],
                alignment: "right",
              },
              "",
              "",
              "",
              "",
              "",
              {
                stack: [
                  {
                    fontSize: 6,
                    text: ".",
                    margin: [0, 0, 0, 5],
                  },
                  {
                    fontSize: 8,
                    text: new DecimalPipe("en-IN").transform(tcs1Perc, ".2"),
                    alignment: "right",
                    margin: [0, 0, 0, 5],
                  },
                  {
                    // text: new DecimalPipe("en-IN").transform(calculatedSubTotalAmount, ".2"),
                    text: new IndianCurrencyPipe().transform(
                      Number(calculatedSubTotalAmount)
                    ),
                    alignment: "right",
                  },
                ],
              },
            ],
            [
              {
                colSpan: 6,
                text: "Total",
                fontSize: 12,
                alignment: "right",
              },
              "",
              "",
              "",
              "",
              "",
              {
                bold: true,
                fontSize: 12,
                // text: new CurrencyPipe('en-IN').transform(calculatedSubTotalAmount + tcs1Perc, 'INR')
                text: new IndianCurrencyPipe().transform(
                  Number(calculatedSubTotalAmount + tcs1Perc)
                ),
              },
            ],
          ] as any),
      },
      layout: {
        hLineWidth: function (i, node) {
          return 2;
        },
        vLineWidth: function (i, node) {
          return 2;
        },
        paddingTop: function (i, node) {
          return 6;
        },
        paddingBottom: function (i, node) {
          return 6;
        },
        hLineColor: function (i, node) {
          return "#fff";
        },
        vLineColor: function (i, node) {
          return "#fff";
        },
        fillColor: function (i, node) {
          return bgColor;
        },
      },
      fontSize: 10,
      width: "100%",
      margin: [20, 10, 20, 0],
    };
    return template;
  }

  private createHSNTable(invoiceData: any) {
    const table = {
      table: {
        widths: ["*", 60, 40, 50, 70],
        body: [
          // Header
          [
            { text: `HSN/SAC`, alignment: `center`, rowSpan: 2 },
            { text: `Taxable Value`, alignment: `center`, rowSpan: 2 },
            { text: `Integrated Tax`, alignment: `center`, colSpan: 2 },
            {},
            { text: `Total Tax Amount`, alignment: `center`, rowSpan: 2 },
          ],
          [
            {},
            {},
            { text: `Rate`, alignment: `center` },
            { text: `Amount`, alignment: `center` },
            {},
          ],
          // Values

          //   [
          //     { text: `996531` },
          //     { text: this.numberFormat(129715), alignment: `right` },
          //     { text: `18%`, alignment: `right` },
          //     { text: this.numberFormat(23348.70), alignment: `right` },
          //     { text: this.numberFormat(23348.70), alignment: `right` },
          //   ],
          //   // Total
          //   [
          //     { text: `Total`, bold: true, alignment: `right` },
          //     { text: this.numberFormat(129715), bold: true, alignment: `right` },
          //     { },
          //     { text: this.numberFormat(23348.70), bold: true, alignment: `right` },
          //     { text: this.numberFormat(23348.70), bold: true, alignment: `right` },
          //   ]
        ]
          .concat(
            invoiceData?.hsnCodeItems?.map((row: any) => {
              return [
                { text: row?.hsnCode },
                {
                  text: this.numberFormat(Number(row?.amount)),
                  alignment: `right`,
                },
                {
                  text: `${invoiceData?.rateDetails?.igstRate}%`,
                  alignment: `right`,
                },
                {
                  text: this.numberFormat(Number(row?.taxableAmount)),
                  alignment: `right`,
                },
                {
                  text: this.numberFormat(Number(row?.taxableAmount)),
                  alignment: `right`,
                },
              ];
            })
          )
          .concat([
            [
              { text: `Total`, bold: true, alignment: `right` },
              {
                text: this.numberFormat(
                  Number(invoiceData?.hsnListTaxableTotalValue)
                ),
                bold: true,
                alignment: `right`,
              },
              {},
              {
                text: this.numberFormat(
                  Number(invoiceData?.hsnListTaxableTotalAmount)
                ),
                bold: true,
                alignment: `right`,
              },
              {
                text: this.numberFormat(
                  Number(invoiceData?.hsnListTaxableTotalAmount)
                ),
                bold: true,
                alignment: `right`,
              },
            ],
          ] as any),
      },
      fontSize: 10,
    };
    const stack = {
      stack: [
        table,
        {
          columns: [
            { text: `Tax Amount (in Words) :`, fontSize: 10, width: `auto` },
            {
              text: `INR ${invoiceData?.hsnTotalValueInWords}`,
              fontSize: 12,
              bold: true,
              width: `*`,
              margin: [1, 0, 0, 0],
            },
          ],
          margin: [0, 5, 0, 0],
        },
      ],
      margin: [20, 5, 20, 5],
    };
    return stack;
  }

  private createRemark(invoiceData: any) {
    const totalAmount = invoiceData.listItems.reduce(
      (total, item) => total + Number(item.rate) * item.qty,
      0
    );
    const exchangeTotalAmount = invoiceData.exchangeListItems.reduce(
      (total, item) => total + Number(item.rate) * item.qty,
      0
    );
    const calculatedTotalAmount =
      Number(totalAmount) - Number(exchangeTotalAmount);
    const tcs1Perc = (calculatedTotalAmount / 100) * 1;
    const finalTotal = calculatedTotalAmount + tcs1Perc;
    const template = {
      columns: [
        {
          width: `*`,
          stack: [
            {
              stack: [
                {
                  text: "E. & O.E.",
                  margin: [0, 0, 0, 5],
                  fontSize: 8,
                },
                { text: `Amount (in words): `, italics: true },
                {
                  text: `INR ${convertAmountToWords(finalTotal)} /-`,
                  bold: true,
                },
              ],
              margin: [0, 0, 0, 10],
            },
            {
              stack: [
                { text: `Notes: `, italics: true },
                { text: invoiceData?.saleDetails?.notes },
              ],
              fontSize: 8,
              margin: [0, 0, 0, 10],
            },
          ],
        },
        {
          stack: [
            { text: `Company Bank Details: `, italics: true },
            { text: `A/c Holder's Name : WISH WHEELS` },
            { text: `Bank Name : ICICI BANK` },
            { text: `A/c No. : 777705060395` },
            { text: `IFS Code : ICIC0001240` },
            { text: `Branch: KHAR W` },
          ],
          width: `auto`,
        },
      ],
      fontSize: 10,
      margin: [20, 20, 20, 20],
    };
    return template;
  }

  private createDeclaration() {
    const template = {
      stack: [
        {
          columns: [
            {
              stack: [
                { text: `Declaration`, decoration: `underline` },
                {
                  alignment: `justify`,
                  text: `We declare that this invoice shows the actual price described and that all particulars are true and correct.`,
                },
                {
                  alignment: `justify`,
                  text: `We hereby declare that this Vehicle is non accidental, non flooded, and the mileage on the cluster is genuine.`,
                },
              ],
              width: `50%`,
            },
            {
              width: "10%",
              text: "",
            },
            {
              width: "40%",
              table: {
                widths: ["*"],
                body: [
                  [
                    {
                      fontSize: 8,
                      alignment: "center",
                      color: "#191919",
                      text: "for M/s Wish Wheels",
                    },
                  ],
                  [
                    {
                      fontSize: 8,
                      alignment: "center",
                      color: "#5c5c5c",
                      text: "Authorised Signatory",
                    },
                  ],
                ],
              },
              layout: {
                paddingBottom: function (i, node) {
                  return i == 0 ? 40 : 0;
                },
                hLineColor: function (i, node) {
                  return i == 1 ? "#fff" : "#e0e0e0";
                },
                vLineColor: function (i, node) {
                  return "#e0e0e0";
                },
              },
              alignment: `right`,
            },
          ],
          fontSize: 8,
        },
      ],
      margin: [20, 20, 20, 0],
    };
    return template;
  }

  // Utils

  private numberFormat(data: number) {
    if (data > 10)
      return data
        .toFixed(2)
        .toString()
        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, `,`);
    else return data.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, `,`);
  }
}
