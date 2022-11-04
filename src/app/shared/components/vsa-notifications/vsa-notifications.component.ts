import { Component, Input, Output, EventEmitter, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NotificationDialogModel } from "./vsa-notifications.model";
// import { ITextConfig } from './dn-form-text.model';
  
@Component ({
    selector: 'vsa-notification',
    templateUrl: './vsa-notifications.component.html',
    styleUrls: ['./vsa-notifications.component.scss']
})

export class VSANotificationComponent {

    constructor(
        public dialogRef: MatDialogRef<VSANotificationComponent>,
        @Inject(MAT_DIALOG_DATA) public notificationModel: NotificationDialogModel) {}

      actionClick(actionCase) {
        if(this.notificationModel.extraOptions) {
          actionCase = {
            primaryAction: actionCase,
            secondaryAction: this.notificationModel.extraOptions.dataModel
          }
        }
        this.dialogRef.close(actionCase);
      }
    
}