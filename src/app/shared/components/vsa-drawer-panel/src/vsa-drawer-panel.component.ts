import {
  Component,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
} from "@angular/core";

@Component({
  selector: "vsa-drawer-panel",
  templateUrl: "./vsa-drawer-panel.component.html",
  styleUrls: ["./vsa-drawer-panel.component.scss"],
})
export class VSADrawerPanelComponent {
  @Input() hasBackdrop: boolean;
  @Input() drawerMode: "side" | "over" | "push";
  @Input() drawerSize:
    | "extra-extra-small"
    | "extra-small"
    | "small"
    | "medium"
    | "large"
    | "extra-large";
  @Input() escClose: boolean;
  @Input() isRightSide: boolean;
  @Input() isActive: boolean;
  @Input() drawerTitle: string;
  @Input() showCloseButton: boolean;
  @Input() drawerContainer: TemplateRef<any>;
  @Input() footerTemplate: TemplateRef<any>;
  @Input() useCustomTemplate: boolean;
  @Output() isActiveChange: EventEmitter<any> = new EventEmitter();

  constructor() {
    // Initialize Default
    this.isRightSide = true;
    this.hasBackdrop = true;
    this.escClose = false;
    this.drawerMode = "over";
    this.isActive = false;
    this.drawerSize = "small";
    this.showCloseButton = false;
  }

  ngOnInit() {
    console.log(this.drawerSize);
  }

  onDrawerToggle(isActive) {
    // this.isActive = isActive;
    // this.isActiveChange.emit(isActive)
  }

  closeDrawer() {
    this.isActive = false;
  }
}
