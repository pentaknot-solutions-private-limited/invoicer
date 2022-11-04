import { IGridActionRendererParams } from "./renderers/grid-action-renderer/grid-action-renderer.component";
import { IGridChipRendererParams } from "./renderers/grid-chip-renderer/grid-chip-renderer.component";
import { IGridMultiRendererParams } from "./renderers/grid-multi-renderer/grid-multi-renderer.component";

export interface IGridConfig {
    colDefs: IGridColDef[]
    rowId: string;
    gridHeightDelta: any;
    rowGroupMode?: any;
    groupRowKey?: any;
    pagination: boolean;
    collapse?: boolean;
    showChildDataKey?: any;
    refreshTable?: boolean;
    hasChildData?: boolean;
    showCheckbox?: boolean;
    showHighlightedText?: boolean;
    showFooter?: boolean;
    footerAction?: any[];
    editable?: boolean;
    childDataArrayName?: string;
    childDataFieldName?: any[];
    emptyMessage?: string | any;
    childColDefs?: IGridColDef[];
}

export interface IGridColDef {
  field?: string;
  headerName: string;
  colType?:
    | "text"
    | "link"
    | "multi"
    | "chips"
    | "actions"
    | "checkbox"
    | "rowspan";
  filterType?: "text" | "date" | "numeric" | "boolean";
  align?: "default" | "right" | "center";
  sortByFormatter?: boolean;
  searchByFormatter?: boolean;
  editable?: boolean;
  rendererParams?:
    | IGridChipRendererParams
    | IGridMultiRendererParams
    | ((
        value: any,
        row: any,
        col: IGridColDef
      ) =>
        | IGridChipRendererParams
        | IGridMultiRendererParams
        | IGridActionRendererParams);
  valueFormatter?: (value: any, row: any, col: IGridColDef) => any;
}

export interface IGridColDef {
  field?: string;
  headerName: string;
  colType?:
    | "text"
    | "link"
    | "multi"
    | "chips"
    | "actions"
    | "checkbox"
    | "rowspan";
  filterType?: "text" | "date" | "numeric" | "boolean";
  align?: "default" | "right" | "center";
  width?: string;
  customWidth?: boolean;
  sortByFormatter?: boolean;
  searchByFormatter?: boolean;
  editable?: boolean;
  showSelectFilter?: boolean;
  linkAction?: string;
  action?: any[];
  class?: string;
  rendererParams?:
    | IGridChipRendererParams
    | IGridMultiRendererParams
    | ((
        value: any,
        row: any,
        col: IGridColDef
      ) =>
        | IGridChipRendererParams
        | IGridMultiRendererParams
        | IGridActionRendererParams);
  valueFormatter?: (value: any, row: any, col: IGridColDef) => any;
}
