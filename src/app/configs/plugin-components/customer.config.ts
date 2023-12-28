import { IGridConfig } from "src/app/shared/components/vsa-grid/vsa-grid.model";
import { ITextConfig } from "src/app/shared/components/vsa-input/vsa-input.model";
import { ISelectConfig } from "src/app/shared/components/vsa-select-box/vsa-select-box.model";
import { dateFormatter } from "src/app/shared/utils/date-formatter";
import { EncryptedStorage } from "src/app/shared/utils/encrypted-storage";
import { formatIndianCurrency } from "src/app/shared/utils/format-indian-currency";

export class CustomerConfig {
  salutationSelect: ISelectConfig = {
    fieldKey: "salutationId",
    attributes: {
      class: "header-item",
      title: "Salutation",
      isMandatory: false,
    },
    dataKey: "name",
    returnKey: "salutationId",
    options: [
      {
        salutationId: 1,
        name: "Mr.",
      },
      {
        salutationId: 2,
        name: "Ms.",
      },
      {
        salutationId: 3,
        name: "Mrs.",
      },
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
    returnKey: "stateId",
    options: [
      {
        stateId: 1,
        name: "Maharashtra",
      },
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
      //   showBorder: true,
      isMandatory: false,
    },
  };
  phone: ITextConfig = {
    fieldKey: "phone",
    attributes: {
      title: "Phone",
      //   showBorder: true,
      isMandatory: false,
    },
  };
  panNo: ITextConfig = {
    fieldKey: "panNo",
    attributes: {
      title: "PAN",
      //   showBorder: true,
      isMandatory: false,
    },
  };
  gstNo: ITextConfig = {
    fieldKey: "gstNo",
    attributes: {
      title: "GST (if applicable)",
      //   showBorder: true,
      isMandatory: false,
    },
  };
  placeOfSupplySelect: ISelectConfig = {
    fieldKey: "posId",
    attributes: {
      class: "header-item",
      title: "Place of supply",
      isMandatory: false,
    },
    dataKey: "name",
    returnKey: "posId",
    options: [
      {
        posId: 1,
        name: "(MH) - Maharashtra",
      },
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
          return `${row.firstName} ${row.lastName}`;
          // return row.invoiceNo ? row.invoiceNo : "-";
        },
      },
      {
        field: "companyName",
        headerName: "Company",
        colType: "text",
        searchByFormatter: true,
      },
      {
        field: "stateId",
        headerName: "State",
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
          return formatIndianCurrency(row.totalDue);
        },
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
            ],
          };
        },
      },
    ],
  };
}
