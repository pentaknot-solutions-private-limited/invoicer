import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { IToggleConfig } from "./vsa-toggle.model";

@Component({
  selector: "vsa-toggle",
  templateUrl: "./vsa-toggle.component.html",
  styleUrls: ["./vsa-toggle.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class VSAToggleComponent {
  @Input() config: IToggleConfig;
  @Input() disabled: boolean;
  @Input() value: any | boolean | number;
  @Output() valueChange: EventEmitter<any | boolean | number> = new EventEmitter();
  @Output() onChange: EventEmitter<IToggleConfig> = new EventEmitter();

  constructor() {}

  changeToggle(e: boolean) {
    this.config.isActive = e;
    this.onChange.emit(this.config);
    this.valueChange.emit(this.value)
  }
}
