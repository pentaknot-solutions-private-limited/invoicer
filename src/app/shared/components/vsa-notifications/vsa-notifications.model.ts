// import { IRadioButtonConfig } from "../rm-radio/rm-radio.model";

export class NotificationDialogModel {
  notificationType:
    | "error"
    | "success"
    | "warning"
    | "delete"
    | "info"
    | "confirm" = "info";
  title?: string;
  message?: string;
  disableClose?: boolean = true;
  extraOptions?: {
    // radioButtons: IRadioButtonConfig;
    dataModel: any;
    fieldName: any; 
  };
  actions?: NotificationActionModel[];
}
export class NotificationActionModel {
  label: string;
  actionCase?: string;
  class?: string;
}
