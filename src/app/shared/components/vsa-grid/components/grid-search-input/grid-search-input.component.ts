import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { VSAGridComponent } from "../../vsa-grid.component";

@Component({
  selector: "grid-search-input",
  templateUrl: "./grid-search-input.component.html",
  styleUrls: ["./grid-search-input.component.scss"],
})
export class GridSearchInputComponent implements OnInit {
  // Params
  @Input() tablesRef: VSAGridComponent;
  // @Output() tablesRefChange: EventEmitter<VSAGridComponent[]> = new EventEmitter()
  @Output() onInputChanged: EventEmitter<any> = new EventEmitter()
  // Variables
  searchedData: string = "";
  constructor() {}

  ngOnInit(): void {}

  searchByInputChange() {
    this.onInputChanged.emit(this.searchedData)
    this.tablesRef.searchValue = this.searchedData;
    // this.tablesRef.forEach((table) => {
    //   table.searchValue = this.searchedData ? this.searchedData : "";
    //   console.log(table.searchValue);
    //   if (table.searchValue) {

    //   }
    // });
  }
}
