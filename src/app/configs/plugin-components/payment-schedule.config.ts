import { IGridConfig } from "src/app/shared/components/vsa-grid/vsa-grid.model";
import { dateFormatter } from "src/app/shared/utils/date-formatter";
import { formatIndianCurrency } from "src/app/shared/utils/format-indian-currency";

export class PaymentScheduleConfig {
  paymentScheduleGrid: IGridConfig = {
    rowId: "paymentId",
    // gridHeightDelta: "calc(100vh - 510px)",
    gridHeightDelta: "calc(100vh - 260px)",
    pagination: false,
    emptyMessage: "No records found.",
    showCheckbox: true,
    colDefs: [
      {
        field: "paymentId",
        headerName: "Sr. No#",
        colType: "text",
        // customWidth: true,

        // valueFormatter: (value, row, col) => {
        //   console.log(row);
        //   return "-";
        // },
      },
      {
        field: "amount",
        headerName: "Amount",
        colType: "text",
        // customWidth: true,
        searchByFormatter: true,
        valueFormatter: (value, row, col) => {
          return formatIndianCurrency(value);
        },
      },
      {
        // field: "modeOfPaymentId",
        field: "modeOfPayment",
        headerName: "Payment Mode",
        colType: "text",
        // customWidth: true,
        valueFormatter: (value, row, col) => {
          return value || "-";
        },
      },
      {
        field: "paymentDate",
        headerName: "Date",
        // showSelectFilter: true,
        colType: "text",
        // customWidth: true,
        searchByFormatter: true,
        valueFormatter: (value, row, col) => {
          return row.paymentDate
            ? dateFormatter(row.paymentDate, "DD MMM yyyy")
            : "-";
        },
      },
      {
        headerName: "Action",
        colType: "actions",
        align: "center",
        width: "200",
        // customWidth: true,
        sortByFormatter: false,
        rendererParams: (value, row, col) => {
          // Get all data from local storage
          return {
            type: "simple",
            row,
            actions: [
              {
                icon: "download-button-2",
                action: "download",
                tooltip: "Download Acknowledgement",
                title: "Download Acknowledgement",
                type: "edit",
              },
            ],
          };
        },
      },
    ],
  };
}
