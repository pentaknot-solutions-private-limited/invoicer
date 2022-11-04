import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  IVSAModalConfig,
  IVSAModalFooterConfigAction,
} from './vsa-modal.model';

@Component({
  selector: 'vsa-modal',
  templateUrl: './vsa-modal.dialog.html',
  styleUrls: ['./vsa-modal.dialog.scss'],
})
export class VSAModalComponent implements OnInit {
  // Parameters
  @Input() config: IVSAModalConfig;
  @ViewChild('content') content: TemplateRef<any>;
  @Output() onClick: EventEmitter<any> = new EventEmitter();
  @Output() onActionClick: EventEmitter<any> = new EventEmitter();
  @Output() afterClosed: EventEmitter<any> = new EventEmitter();

  //Variables
  dialogRef: MatDialogRef<any>;

  //Temp

  constructor(private dialog: MatDialog) {
    // Initialize Default Properties
  }

  clickBtn(button) {
    this.onClick.emit(button);
  }

  ngOnInit() {
    // console.log(this.content);
  }

  openDialog(): any {
    let modalWidth = '620px';
    let modalHeight = '326px';

    if (this.config.size == 'sm') {
      modalWidth = '424px';
      modalHeight = '260px';
    } else if (this.config.size == 'md') {
      modalWidth = '500px';
      modalHeight = '358px';
    } else if (this.config.size == 'xmd') {
      modalWidth = '887px';
      modalHeight = '587px';
    } else if (this.config.size == 'lg') {
      modalWidth = '800px';
      modalHeight = '550px';
    } else if (this.config.size == 'xl') {
      modalWidth = '1140px';
      modalHeight = '550px';
    } else if (this.config.size == 'full') {
      modalWidth = '100vw';
      modalHeight = '100vh';
    }

    this.dialogRef = this.dialog.open(this.content, {
      // minWidth: this.config.size == "full" ? modalWidth : "auto",
      // width: this.config.size == "full" ? "auto" : modalWidth,
      // height: modalHeight,
      width: this.config.width || modalWidth,
      height: this.config.height || modalHeight,
      autoFocus: this.config.autoFocus,
      disableClose: this.config.disableClose,
      panelClass: 'vsa-modal',
      data: {
        config: null,
        content: this.content.elementRef.nativeElement,
      },
    });
    this.dialogRef.afterClosed().subscribe((result) => {
      this.afterClosed.emit();
      switch (result) {
        default:
          break;
      }
    });
  }

  actionBtnClick(actionEvent: IVSAModalFooterConfigAction) {
    switch (actionEvent.methodCallback) {
      case 'close':
        this.closeModal();
        break;
      default:
        this.onActionClick.emit(actionEvent);
        break;
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  expandToggle() {}
}
