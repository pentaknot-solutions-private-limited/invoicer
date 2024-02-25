import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from "@angular/core";
import { SortEvent } from "primeng/api";
import { EditableColumn, Table } from "primeng/table";
import { IGridColDef, IGridConfig } from "./vsa-grid.model";
import {
  AUTO_STYLE,
  animate,
  state,
  style,
  transition,
  trigger,
  keyframes,
} from "@angular/animations";
import { findDistinctValues } from "../../utils/distinct.values";
const DEFAULT_DURATION = 300;
import * as FileSaver from "file-saver";

@Component({
  selector: "vsa-grid",
  templateUrl: "./vsa-grid.component.html",
  styleUrls: ["./vsa-grid.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger("collapse", [
      state(
        "false",
        style({
          opacity: AUTO_STYLE,
          height: AUTO_STYLE,
        })
      ),
      state(
        "true",
        style({
          opacity: 0,
          height: 0,
        })
      ),
      transition("false => true", animate(DEFAULT_DURATION + "ms ease-in")),
      transition("true => false", animate(DEFAULT_DURATION + "ms ease-out")),
    ]),
  ],
})
export class VSAGridComponent implements OnInit, OnChanges {
  // View Childs
  @ViewChild("gridComp") gridComp: Table;
  @ViewChild(EditableColumn) editableColumn: EditableColumn;
  @ViewChildren(EditableColumn)
  private editableColumns: QueryList<EditableColumn>;
  // Parameters
  @Input() config: IGridConfig;
  @Input() rowData: any[] = [];
  @Input() selectedRows: any[] = [];
  @Input() title: string = "";
  @Output() onLinkClick: EventEmitter<any> = new EventEmitter();
  @Output() onEditDone: EventEmitter<any> = new EventEmitter();
  @Output() actionClicked: EventEmitter<any> = new EventEmitter();

  // Variables
  paginationCount = 10;
  searchValue: string = "";
  showTable: boolean = true;

  editCell: boolean = false;
  showHighlight: boolean = true;
  pEditableColumn = "pEditableColumn";
  editClicked: boolean = false;
  rowGroupMetadata: any[] = [];
  rowIndex: any;
  constructor(private cdref: ChangeDetectorRef) {
    // Initialize Default Properties
  }

  get availableCount() {
    if (this.config.pagination && this.gridComp) {
      return this.gridComp.rows;
    }
    return this.rowData?.length;
  }

  updateRowGroupMetaData(rowData, key) {
    this.rowGroupMetadata = [];
    if (rowData) {
      const myCounts = rowData.reduce((counts, item) => {
        if (counts[item[key]] === undefined) counts[item[key]] = 0;
        counts[item[key]]++;
        return counts;
      }, {});
      return myCounts;
    }
  }

  convertToInt(data) {
    return parseInt(data);
  }

  ngOnInit() {
    window.addEventListener("resize", () => {
      if (this.config.gridHeightDelta) {
        this.config.gridHeightDelta += 1;
        setTimeout(() => {
          this.config.gridHeightDelta -= 1;
        }, 100);
      }
    });
  }
  ngOnChanges() {
    this.cdref.detectChanges();
  }

  exportExcel(fileName: string = "TEST") {
    // #1. Check if row is checked
    const exportableRows =
      this.selectedRows?.length > 0 ? this.selectedRows : this.rowData;
    // #2. Filter visible columns
    const visibleColumns = this.config.colDefs
      .filter((col: IGridColDef) => col.colType != "actions")
      .map((column: IGridColDef) => column);
    import("xlsx").then((xlsx) => {
      // Export visible columns only
      const filteredData = exportableRows.map((row) => {
        const filteredRow = {};
        visibleColumns.forEach((column) => {
          filteredRow[column.field] = row[column.field];
        });
        return filteredRow;
      });
      // const worksheet = xlsx.utils.json_to_sheet(this.rowData);
      const worksheet = xlsx.utils.json_to_sheet(filteredData);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      this.saveAsExcelFile(excelBuffer, fileName);
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    let EXCEL_EXTENSION = ".xlsx";
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  onRowSelect(event) {
    this.actionClicked.emit(this.selectedRows);
  }
  onRowUnselect(event) {
    this.actionClicked.emit(this.selectedRows);
  }

  selectAllRow() {
    this.actionClicked.emit(this.selectedRows);
  }

  callOnActionLink(col, action?) {
    if (action) {
      const event = {
        data: col,
        action: action,
      };
      this.onLinkClick.emit(event);
    } else {
      this.onLinkClick.emit(col);
    }
  }

  onActionClick(event: any) {
    this.actionClicked.emit(event);
  }

  refreshTable() {
    this.actionClicked.emit("refreshTable");
  }

  onRowEditInit(event) {
    this.editClicked = true;
  }

  onEditComplete(event) {
    this.onEditDone.emit(this.rowData);
  }

  onChildActionClicked(event: any, row: any) {
    // console.log(row);
    const eventRow = {
      data: {
        ...row,
        stepData: event.data,
        event: event.event,
      },
    };
    this.actionClicked.emit(eventRow);
  }

  onFooterActionClicked(data: any, event: any) {
    const eventData = {
      event: event,
      data: data,
    };
    this.actionClicked.emit(eventData);
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      const colObj = this.config.colDefs.find(
        (col) => col.field == event.field
      );
      let value1: any;
      let value2: any;
      if (colObj && colObj.valueFormatter && colObj.sortByFormatter) {
        value1 = colObj.valueFormatter(data1[event.field], data1, colObj);
        value2 = colObj.valueFormatter(data2[event.field], data2, colObj);
      } else {
        value1 = data1[event.field];
        value2 = data2[event.field];
      }
      let result = null;

      if (value1 == null && value2 != null) result = -1;
      else if (value1 != null && value2 == null) result = 1;
      else if (value1 == null && value2 == null) result = 0;
      else if (typeof value1 === "string" && typeof value2 === "string")
        result = value1.localeCompare(value2);
      else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

      return event.order * result;
    });
  }
  clear(table: Table) {
    table.clear();
  }

  getAllColField() {
    const filter = this.config.colDefs.filter((row: any) => row.field);
    return filter.map((row: any) => {
      if (row.field != undefined) {
        return row.field;
      }
    });
  }

  hideshowTable() {
    if (this.config?.collapse) this.showTable = !this.showTable;
  }

  getClassName(row, config, col) {
    if (
      row &&
      row["cl_id"] == 1 &&
      row["policy_no"] == 2 &&
      row.permission &&
      config.showHighlightedText &&
      col.field != "confidence" &&
      col.field != "cl_id" &&
      col.field != "data_policy_clauses"
    ) {
      if (row.permission == "Allowed") {
        return "completed";
      } else if (row.permission == "Need client consent") {
        return "warning";
      } else {
        return "error";
      }
    }
  }

  getUniqueValue(field, rowData) {
    return findDistinctValues(rowData, field);
  }

  getExpandedValue(expanded) {
    this.showHighlight = expanded;
  }
}
