import {
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import {
  IVSAButtonActionItemConfig,
  ISplitButtonConfig,
} from "./vsa-button.model";

@Component({
  selector: "vsa-button",
  templateUrl: "./vsa-button.component.html",
  styleUrls: ["./vsa-button.component.scss"],
})
export class VSAButtonComponent implements OnInit, DoCheck {
  // Parameters
  @Input() disabled: boolean;
  @Input() onlyIconButton: boolean;
  @Input() type: string; // reset, submit, button
  @Input() role: string; // primary, secondary, tertiary.
  @Input() size: string; // default, medium, small.
  @Input() color: string; // blue, orange, red, light-orange
  @Input() icon: string | any;
  @Input() iconSize: string | any; // Default, small
  @Input() iconPosition: string; // suffix, prefix
  @Input() loadingText?: string; // suffix, prefix
  @Input() iconColor?: string; // suffix, prefix
  @Input() loading: boolean | any;
  @Input() noTextInMobileView: boolean;
  @Input() customColor: string | any;
  @Input() fullWidth: boolean | any;
  @Input() SplitConfig: ISplitButtonConfig | any;
  @Input() DropDownConfigs: IVSAButtonActionItemConfig[] | any;
  @Output() onClick: EventEmitter<any> = new EventEmitter();
  @Output() onActionClick: EventEmitter<any> = new EventEmitter();

  //Variables
  randomBtnId = Math.floor(Math.random() * Math.floor(50)) + "split-btn";

  //Temp

  constructor() {
    // Initialize Default Properties
    this.onlyIconButton = false;
    this.size = "default"; // default, medium, small
    this.type = "button"; // reset, submit, button
    this.role = "primary"; //primary, secondary, tertiary, custom
    this.color = "blue"; //blue, orange, red, light-orange, default
    this.disabled = false;
    this.icon = null;
    this.iconPosition = "suffix";
    this.noTextInMobileView = false;
    // this.iconSize = "small";
    this.SplitConfig == null;
    this.fullWidth = false;
    // customColor Pass Color Code when type is custom;
  }

  clickBtn(button: any) {
    this.onClick.emit(button);
  }

  actionClick(button: any) {
    this.onActionClick.emit(button);
  }
  test() {
    // console.log('enter')
  }

  ngOnInit() {}

  ngDoCheck() {
    // Set Width of Split DropDown Panel Dynamically Based on Button Size
    const button = document.getElementById(this.randomBtnId);
    let btnWidth;
    if (button) {
      btnWidth = button.offsetWidth;
    }
    var elems = document.getElementsByClassName(
      "mat-menu-panel " + this.randomBtnId
    );
    if (elems.length != 0) {
      for (var i = 0; i < elems.length; i++) {
        const element: any = elems[i];
        element.style.width = btnWidth + "px";
      }
    }
  }
}
