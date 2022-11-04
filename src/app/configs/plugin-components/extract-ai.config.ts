import * as moment from "moment";
import { IGridConfig } from "src/app/shared/components/vsa-grid/vsa-grid.model";
import { ITextConfig } from "src/app/shared/components/vsa-input/vsa-input.model";

export class ExtractAIConfigs {
  uploadFilesGrid: IGridConfig = {
    rowId: "id",
    gridHeightDelta: 'calc(100vh - 260px)',
    pagination: true,
    hasChildData: true,
    showCheckbox: true,
    showFooter: true,
    showChildDataKey: 'showSteps',
    childDataArrayName: 'steps',
    emptyMessage: "No files uploaded.",
    colDefs: [
      {
        field: "name",
        headerName: "Name",
        colType: "link",
        width: '24.25%',
        customWidth: true
      },
      {
        field: "status",
        headerName: "Status",
        colType: "multi",
        showSelectFilter: true,
        rendererParams: (value, row, col) => {
          if (row.status == "Complete") {
            return {
              fontSize: "12px",
              color: "green",
              fontWeight: 500,
              class: "completed",
            };
          } else {
            return {
              fontSize: "12px",
              color: "primary",
              fontWeight: 500,
            };
          }
        },
        
        // sortByFormatter: true,
        // searchByFormatter: true,
        // valueFormatter: (value, row, col) => {
        //   return value[0].name;
        // },
        // rendererParams: (value, row, col) => {
        //   return {
        //     customColor: value[1].color,
        //   };
        // },
      },
      {
        field: "fileType",
        headerName: "File Type",
        colType: "multi",
        // width: '150px',
        showSelectFilter: true,
        // align: "center",
        rendererParams: (value, row, col) => {
          if (row.fileType == "PDF") {
            return {
              fontSize: "12px",
              color: "#008000",
              fontWeight: 500,
              class: "completed",
              onlyIcon: true,
              matIcon: 'picture_as_pdf'
            };
          } else {
            return {
              fontSize: "12px",
              color: "primary",
              fontWeight: 500,
            };
          }
        }
      },
      {
        field: "fileSize",
        headerName: "File Size",
        colType: "text",
        align: 'default'
        // width: '150px',
      },
      {
        headerName: 'Action',
        colType: 'actions',
        align: 'center',
        sortByFormatter: false,
        rendererParams: (value, row, col) => {
          return {
            type: 'simple',
            row,
            actions: [
              {
                icon: 'delete-bin-1',
                action: 'delete',
                tooltip: 'Delete Policies',
                title: 'Delete Policies',
                type: 'delete',
                color: 'red',
                disabled: row.showSteps
              },
            ],
          };
        },
      },
      // {
      //   headerName: 'Action',
      //   colType: 'actions',
      //   align: 'center',
      //   sortByFormatter: false,
      //   rendererParams: (value, row, col) => {
      //     if (row.status == 'Completed') {
      //       return {
      //         text: 'Download',
      //         type: 'text-icon',
      //         color: '#ffffff',
      //         class: 'download',
      //         action: 'download-completed',
      //         row,
      //         actions: [
      //           {
      //             icon: 'archive',
      //             action: 'archive-completed',
      //             color: '#A4B0C0',
      //             comment: 'Archive',
      //             // tooltip: "Reset Password",
      //             // title: "Reset Password",
      //             type: 'text-icon',
      //           },
      //         ],
      //       };
      //     } else {
      //       return {
      //         type: 'empty',
      //         row,
      //         actions: [],
      //       };
      //     }
      //   },
      // },
    ],
    childColDefs: [
      {
        headerName: "Sr. No.",
        width: '7%',
        customWidth: true
      },
      {
        headerName: "Steps",
        width: '15.9%',
        customWidth: true
      },
      {
        headerName: "Status",
        width: '21.3%',
        customWidth: true
      },
      {
        headerName: "Confidence",
        width: '21.75%',
        customWidth: true
      },
      {
        headerName: "Results",
      },
    ],
    // footerAction: [
    //   {
    //     role: "primary",
    //     color: "blue",
    //     size: "medium",
    //     action: "download-checked",
    //     text: "Download"
    //   },
    //   {
    //     role: "secondary",
    //     color: "blue",
    //     size: "medium",
    //     action: "archive-checked",
    //     text: "Archive"
    //   },
    // ]
  };

  // Steps

  // Step #2 (Entity and Clause Extraction)
  entityAndClauseExtractionGrid: IGridConfig = {
    rowId: "item_no",
    gridHeightDelta: 'calc(100vh - 200px)',
    pagination: false,
    showFooter: true,
    emptyMessage: "No records found.",
    // rowGroupMode: "rowspan",
    // groupRowKey: "item_group",
    colDefs: [
      {
        field: "item_no",
        headerName: "Sr. No.",
        colType: "text",
        valueFormatter: (value, row, col) => {
          return row.item_no ? row.item_no : '-';
        },
        width: '120px',
        customWidth: true
      },
      {
        field: "item_group",
        headerName: "Item Group",
        colType: "text",
        valueFormatter: (value, row, col) => {
          return row.item_group ? row.item_group : '-';
        },
        // Bold and Need Row Span
      },
      {
        field: "item",
        headerName: "Item",
        colType: "text",
        valueFormatter: (value, row, col) => {
          return row.item ? row.item : '-';
        },
      },
      {
        field: "value",
        headerName: "Value",
        colType: "text",
        editable: true,
        valueFormatter: (value, row, col) => {
          return row.value ? row.value : '-';
        },
        width: '650px',
        customWidth: true
        // Highlight editable
      },
      {
        field: "confidence",
        headerName: "Confidence",
        colType: "text",
        showSelectFilter: true,
        valueFormatter: (value, row, col) => {
          return row.confidence ? row.confidence : '-';
        },
        width: '150px',
        customWidth: true
      },
    ],
  };

  // Step #3 (Policy Generation)
  policyGenerationGrid: IGridConfig = {
    rowId: "policy_no",
    gridHeightDelta: 'calc(100vh - 200px)',
    pagination: false,
    showFooter: true,
    emptyMessage: "No records found.",
    // rowGroupMode: "rowspan",
    // groupRowKey: "cl_id",
    colDefs: [
      {
        field: "cl_id",
        headerName: "Cl. ID",
        colType: "text",
        valueFormatter: (value, row, col) => {
          return row.cl_id ? row.cl_id : '-';
        },
        width: '95px',
        customWidth: true
        // Bold and Need Row Span
      },
      {
        field: "data_policy_clauses",
        headerName: "Data Policy Clauses",
        colType: "text",
        valueFormatter: (value, row, col) => {
          return row.data_policy_clauses ? row.data_policy_clauses : '-';
        },
      },
      {
        field: "policy_no",
        headerName: "Pl. ID",
        colType: "text",
        valueFormatter: (value, row, col) => {
          return row.policy_no ? row.policy_no : '-';
        },
        width: '95px',
        customWidth: true
      },
      {
        field: "policy_statements",
        headerName: "Policy Statements",
        colType: "text",
        editable: true,
        valueFormatter: (value, row, col) => {
          return row.policy_statements ? row.policy_statements : '-';
        },
        // Highlight editable
      },
      {
        field: "entity",
        headerName: "Entity",
        colType: "text",
        showSelectFilter: true,
        editable: true,
        valueFormatter: (value, row, col) => {
          return row.entity ? row.entity : '-';
        },
        width: '150px',
        customWidth: true
      },
      {
        field: "use_case",
        headerName: "Use Case",
        colType: "text",
        showSelectFilter: true,
        editable: true,
        valueFormatter: (value, row, col) => {
          return row.use_case ? row.use_case : '-';
        },
        width: '215px',
        customWidth: true
      },
      {
        field: "region",
        headerName: "Region",
        colType: "text",
        showSelectFilter: true,
        editable: true,
        valueFormatter: (value, row, col) => {
          return row.region ? row.region : '-';
        },
        width: '100px',
        customWidth: true
      },
      {
        field: "permission",
        headerName: "Permission",
        colType: "text",
        showSelectFilter: true,
        editable: true,
        valueFormatter: (value, row, col) => {
          return row.permission ? row.permission : '-';
        },
        width: '180px',
        customWidth: true
      },
      {
        field: "confidence",
        headerName: "Confidence",
        colType: "text",
        showSelectFilter: true,
        valueFormatter: (value, row, col) => {
          return row.confidence ? row.confidence : '-';
        },
        width: '120px',
        customWidth: true
      },
    ],
  };

  // Step #4 (Policy Sync & Storage)
  policySyncStorageGrid: IGridConfig = {
    rowId: "id",
    gridHeightDelta: 'calc(100vh - 200px)',
    pagination: false,
    showFooter: true,
    emptyMessage: "No records found.",
    colDefs: [
      {
        field: "id",
        headerName: "Sr. No.",
        colType: "text",
        valueFormatter: (value, row, col) => {
          return row.id ? row.id : '-';
        },
        // Bold and Need Row Span
      },
      {
        field: "table",
        headerName: "Table",
        colType: "text",
        valueFormatter: (value, row, col) => {
          return row.table ? row.table : '-';
        },
      },
      {
        field: "status",
        headerName: "Status",
        colType: "text",
        valueFormatter: (value, row, col) => {
          return row.status ? row.status : '-';
        },
      },
      {
        field: "timestamp",
        headerName: "Timestamp",
        colType: "text",
        valueFormatter: (value, row, col) => {
          return row.timestamp ? row.timestamp : '-';
        },
        // Highlight editable
      }
    ],
  };
}
