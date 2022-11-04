import { InjectionToken } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { ComponentType } from '../portal/portal';
import { ToastRef } from './toast-injector';

export type ProgressAnimationType = 'increasing' | 'decreasing';


export interface IndividualConfig {
  disableTimeOut: boolean | 'timeOut' | 'extendedTimeOut';
  timeOut: number;
  closeButton: boolean;
  extendedTimeOut: number;
  progressBar: boolean;
  progressAnimation: ProgressAnimationType;
  enableHtml: boolean;
  toastClass: string;
  positionClass: string;
  titleClass: string;
  messageClass: string;
  easing: string;
  easeTime: string | number;
  tapToDismiss: boolean;
  toastComponent?: ComponentType<any>;
  onActivateTick: boolean;
  newestOnTop: boolean;
  toastWidth?: string;
}

export interface ToastyIconClasses {
  error: string;
  info: string;
  success: string;
  warning: string;
  [key: string]: string;
}

export interface GlobalConfig extends IndividualConfig {
  maxOpened: number;
  autoDismiss: boolean;
  iconClasses: Partial<ToastyIconClasses>;
  preventDuplicates: boolean;
  countDuplicates: boolean;
  resetTimeoutOnDuplicate: boolean;
  includeTitleDuplicates: boolean;
}

//  Everything a toast needs to launch
export class ToastPackage {
  private _onTap = new Subject<void>();
  private _onAction = new Subject<any>();

  constructor(
    public toastId: number,
    public config: IndividualConfig,
    public message: string | null | undefined,
    public title: string | undefined,
    public toastType: string,
    public toastRef: ToastRef<any>,
  ) {
    this.toastRef.afterClosed().subscribe(() => {
      this._onAction.complete();
      this._onTap.complete();
    });
  }

  /** Fired on click */
  triggerTap(): void {
    this._onTap.next();
    if (this.config.tapToDismiss) {
      this._onTap.complete();
    }
  }

  onTap(): Observable<void> {
    return this._onTap.asObservable();
  }

  /** available for use in custom toast */
  triggerAction(action?: any): void {
    this._onAction.next(action);
  }

  onAction(): Observable<void> {
    return this._onAction.asObservable();
  }
}

/* tslint:disable:no-empty-interface */
/** @deprecated use GlobalConfig */
export interface GlobalToastyConfig extends GlobalConfig {}
/** @deprecated use IndividualConfig */
export interface IndividualToastyConfig extends IndividualConfig {}
/** @deprecated use IndividualConfig */
export interface ToastyConfig extends IndividualConfig {}

export const DefaultNoComponentGlobalConfig: GlobalConfig = {
  maxOpened: 0,
  autoDismiss: false,
  newestOnTop: true,
  preventDuplicates: false,
  countDuplicates: false,
  resetTimeoutOnDuplicate: false,
  includeTitleDuplicates: false,

  iconClasses: {
    error: 'toast-error',
    info: 'toast-info',
    success: 'toast-success',
    warning: 'toast-warning',
  },

  // Individual
  closeButton: false,
  disableTimeOut: false,
  timeOut: 5000,
  extendedTimeOut: 1000,
  enableHtml: false,
  progressBar: false,
  toastClass: 'vsa-toasty',
  positionClass: 'toast-top-right',
  titleClass: 'toast-title',
  messageClass: 'toast-message',
  easing: 'ease-in',
  easeTime: 300,
  tapToDismiss: true,
  onActivateTick: false,
  progressAnimation: 'decreasing',
};

export interface ToastToken {
  default: GlobalConfig;
  config: Partial<GlobalConfig>;
}

export const TOAST_CONFIG = new InjectionToken<ToastToken>('ToastConfig');
