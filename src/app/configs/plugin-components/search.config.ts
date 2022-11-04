import * as moment from 'moment';
import { IGridConfig } from 'src/app/shared/components/vsa-grid/vsa-grid.model';
import { ITextConfig } from 'src/app/shared/components/vsa-input/vsa-input.model';
import { ISelectConfig } from 'src/app/shared/components/vsa-select-box/vsa-select-box.model';

export class SearchConfigs {

  // Search Grid
  searchGrid: IGridConfig = {
    rowId: 'id',
    gridHeightDelta: 'calc(100vh - 340px)',
    pagination: true,
    emptyMessage:
      'No records found.',
    colDefs: [
      {
        field: "contract",
        headerName: "Contract",
        colType: "text",
      },
      {
        field: "affiliate",
        headerName: "Affiliate",
        colType: "text",
      },
      {
        field: "product",
        headerName: "Product",
        colType: "text",
      },
      {
        field: "client",
        headerName: "Client",
        colType: "text",
        width: '180px',
        customWidth: true
      },
      {
        field: "last_processed",
        headerName: "Last Processed",
        colType: "text",
      },
      {
        field: "clauses",
        headerName: "Clauses",
        colType: "link",
        linkAction: 'clauses',
        width: '100px',
        customWidth: true
        
      },
      {
        field: "policies",
        headerName: "Policies",
        colType: "link",
        linkAction: 'policies',
        width: '100px',
        customWidth: true
      },
    ],
  };
}
