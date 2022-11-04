import { MatDialog } from "@angular/material/dialog";
import { VSANotificationComponent } from "./vsa-notifications.component";
import { NotificationDialogModel } from "./vsa-notifications.model";

export function GenerateDialog(dialog: MatDialog, dialogConfig: NotificationDialogModel) {
    
    return dialog.open<VSANotificationComponent, NotificationDialogModel>(VSANotificationComponent, {
        width: '624px',
        height: '225px',
        autoFocus: false,
        disableClose: dialogConfig.disableClose,
        panelClass: 'notification_overlay',
        data: dialogConfig
      })
} 