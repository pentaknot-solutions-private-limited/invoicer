import { IGridConfig } from "src/app/shared/components/vsa-grid/vsa-grid.model";
import { ITextConfig } from "src/app/shared/components/vsa-input/vsa-input.model";
import { IRadioButtonConfig } from "src/app/shared/components/vsa-radio/vsa-radio.model";
import { ISelectConfig } from "src/app/shared/components/vsa-select-box/vsa-select-box.model";
import { dateFormatter } from "src/app/shared/utils/date-formatter";
import { EncryptedStorage } from "src/app/shared/utils/encrypted-storage";
import { formatIndianCurrency } from "src/app/shared/utils/format-indian-currency";

export class CustomerConfig {
  customerTypeOption: IRadioButtonConfig = {
    fieldKey: "customerTypeId",
    attributes: {
      label: "Customer Type",
      isMandatory: true,
    },
    options: [
      // {
      //   value: 1,
      //   label: "Individual",
      // },
      // {
      //   value: 2,
      //   label: "Business",
      // },
    ],
  };
  salutationSelect: ISelectConfig = {
    fieldKey: "salutationId",
    attributes: {
      class: "header-item",
      title: "Salutation",
      isMandatory: false,
    },
    dataKey: "name",
    returnKey: "_id",
    options: [
      // {
      //   salutationId: 1,
      //   name: "Mr.",
      // },
      // {
      //   salutationId: 2,
      //   name: "Ms.",
      // },
      // {
      //   salutationId: 3,
      //   name: "Mrs.",
      // },
      // {
      //   salutationId: 4,
      //   name: "M/s.",
      // },
    ],
    searchBy: [
      {
        key: "name",
      },
    ],
    isMultiple: false,
  };

  firstName: ITextConfig = {
    fieldKey: "firstName",
    attributes: {
      title: "First Name",
      //   showBorder: true,
      isMandatory: true,
    },
  };
  middleName: ITextConfig = {
    fieldKey: "middleName",
    attributes: {
      title: "Middle Name",
      //   showBorder: true,
      isMandatory: false,
    },
  };
  lastName: ITextConfig = {
    fieldKey: "lastName",
    attributes: {
      title: "Last Name",
      //   showBorder: true,
      isMandatory: false,
    },
  };
  companyName: ITextConfig = {
    fieldKey: "companyName",
    attributes: {
      title: "Company Name",
      //   showBorder: true,
      isMandatory: false,
    },
  };

  // Add
  addressLine1: ITextConfig = {
    fieldKey: "addressLine1",
    attributes: {
      title: "Address Line 1",
      //   showBorder: true,
      isMandatory: true,
    },
  };
  addressLine2: ITextConfig = {
    fieldKey: "addressLine2",
    attributes: {
      title: "Address Line 2",
      //   showBorder: true,
      isMandatory: false,
    },
  };
  city: ITextConfig = {
    fieldKey: "city",
    attributes: {
      title: "City",
      //   showBorder: true,
      isMandatory: false,
    },
  };
  stateSelect: ISelectConfig = {
    fieldKey: "stateId",
    attributes: {
      class: "header-item",
      title: "State",
      isMandatory: false,
    },
    dataKey: "name",
    returnKey: "_id",
    options: [
      // {
      //   stateId: 1,
      //   name: "Maharashtra",
      // },
    ],
    searchBy: [
      {
        key: "name",
      },
    ],
    isMultiple: false,
  };
  pincode: ITextConfig = {
    fieldKey: "pincode",
    attributes: {
      title: "Pincode",
      type: "number",
      //   showBorder: true,
      isMandatory: false,
    },
  };
  phone: ITextConfig = {
    fieldKey: "mobileNo",
    attributes: {
      title: "Mobile No.",
      //   showBorder: true,
      isMandatory: true,
    },
  };
  altPhone: ITextConfig = {
    fieldKey: "altMobileNo",
    attributes: {
      title: "Alternate Mobile No.",
      //   showBorder: true,
      isMandatory: false,
    },
  };
  email: ITextConfig = {
    fieldKey: "email",
    attributes: {
      title: "Email address",
      type: "email",
      //   showBorder: true,
      pattern:
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      customPatternMessage: "Please enter a valid email address.",
      isMandatory: true,
    },
  };
  panNo: ITextConfig = {
    fieldKey: "pan",
    attributes: {
      title: "PAN",
      //   showBorder: true,
      isMandatory: true,
    },
  };
  gstNo: ITextConfig = {
    fieldKey: "gst",
    attributes: {
      title: "GST (if applicable)",
      //   showBorder: true,
      isMandatory: false,
    },
  };
  placeOfSupplySelect: ISelectConfig = {
    fieldKey: "placeOfSupplyId",
    attributes: {
      class: "header-item",
      title: "Place of supply",
      isMandatory: false,
    },
    dataKey: "name",
    returnKey: "_id",
    options: [
      // {
      //   posId: 1,
      //   name: "(MH) - Maharashtra",
      // },
    ],
    searchBy: [
      {
        key: "name",
      },
    ],
    isMultiple: false,
  };

  // Listing
  // Invoice Grid
  customerGrid: IGridConfig = {
    rowId: "id",
    gridHeightDelta: "calc(100vh - 310px)",
    pagination: true,
    emptyMessage: "No records found.",
    colDefs: [
      {
        field: "firstName",
        headerName: "Customer Name",
        colType: "link",
        searchByFormatter: true,
        valueFormatter: (value, row, col) => {
          return (
            (value
              ? `${row.firstName} ${row?.middleName || ""} ${
                  row.lastName || ""
                }`
              : row["companyName"]) || "-"
          );
          // return row.invoiceNo ? row.invoiceNo : "-";
        },
      },
      // {
      //   field: "companyName",
      //   headerName: "Company",
      //   colType: "text",
      //   searchByFormatter: true,
      //   valueFormatter: (val: any) => val || "-",
      // },
      {
        field: "mobileNo",
        headerName: "Mobile No.",
        colType: "text",
        searchByFormatter: true,
      },
      // {
      //   field: "altMobileNo",
      //   headerName: "Alt Mobile No.",
      //   colType: "text",
      //   searchByFormatter: true,
      //   valueFormatter: (value, row, col) => value || "-",
      // },
      {
        field: "email",
        headerName: "Email",
        colType: "text",
        searchByFormatter: true,
      },
      {
        field: "totalDue",
        headerName: "Receivable",
        colType: "text",
        searchByFormatter: true,
        valueFormatter: (value, row, col) => {
          // return row.totalDue ? row.totalDue : "-";
          return value ? formatIndianCurrency(row.totalDue) : "-";
        },
      },
      {
        field: "updatedAt",
        headerName: "Last Modified",
        // showSelectFilter: true,
        colType: "text",
        searchByFormatter: true,
        valueFormatter: (value, row, col) => {
          return value ? dateFormatter(value, "DD MMM yyyy, hh:mm A") : "-";
        },
        sortByFormatter: true,
      },
      {
        headerName: "Action",
        colType: "actions",
        align: "center",
        sortByFormatter: false,
        rendererParams: (value, row, col) => {
          return {
            type: "simple",
            row,
            actions: [
              {
                icon: "edit-write-1",
                action: "edit",
                tooltip: "Edit Customer",
                title: "Edit Customer",
                type: "edit",
              },
              {
                icon: "delete-bin-1",
                action: "delete",
                tooltip: "Delete Customer",
                title: "Delete Customer",
                type: "delete",
              },
            ],
          };
        },
      },
    ],
  };
}
