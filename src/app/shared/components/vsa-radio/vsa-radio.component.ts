import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from "@angular/core";
import { IRadioButtonConfig } from "./vsa-radio.model";

@Component({
  selector: "vsa-radio",
  templateUrl: "./vsa-radio.component.html",
  styleUrls: ["./vsa-radio.component.scss"],
})
export class VSARadioComponent implements OnInit {
  // Parameters
  @Input() config!: IRadioButtonConfig;
  @Input() dataModel!: any;
  @Input() extraTemplate!: TemplateRef<any>;
  @Output() onChange: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  radioChange(event: any) {
    this.onChange.emit(event.value);
  }
}
