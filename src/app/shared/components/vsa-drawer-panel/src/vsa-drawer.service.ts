import { HttpClient } from "@angular/common/http";
import { Injectable, TemplateRef } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { GlobalConfig } from "src/app/configs/global-config";

@Injectable()
export class DrawerPanelService {
  constructor() {}

  // Observable config properties sources
  private drawerContainerSource = new Subject<TemplateRef<any>>();
  private footerTemplateSource = new Subject<TemplateRef<any>>();
  private hasBackdropSource = new Subject<boolean>();
  private isActiveSource = new Subject<boolean>();
  private drawerModeSource = new Subject<"side" | "over" | "push">();
  private drawerSizeSource = new Subject<
    | "extra-extra-small"
    | "extra-small"
    | "small"
    | "medium"
    | "large"
    | "extra-large"
  >();
  private escCloseSource = new Subject<boolean>();
  private isRightSideSource = new Subject<boolean>();
  private drawerTitleSource = new Subject<string>();
  private showCloseButtonSource = new Subject<boolean>();
  private useCustomTemplateSource = new Subject<boolean>();

  // Observable string streams
  drawerContainer$ = this.drawerContainerSource.asObservable();
  footerTemplate$ = this.footerTemplateSource.asObservable();
  hasBackdrop$ = this.hasBackdropSource.asObservable();
  drawerMode$ = this.drawerModeSource.asObservable();
  isActive$ = this.isActiveSource.asObservable();
  drawerSize$ = this.drawerSizeSource.asObservable();
  escClose$ = this.escCloseSource.asObservable();
  isRightSide$ = this.isRightSideSource.asObservable();
  drawerTitle$ = this.drawerTitleSource.asObservable();
  showCloseButton$ = this.showCloseButtonSource.asObservable();
  useCustomTemplate$ = this.useCustomTemplateSource.asObservable();

  // Service message commands
  createContainer(containerTemplate: TemplateRef<any>) {
    console.log("Drawer Init");
    this.drawerContainerSource.next(containerTemplate);
  }

  addFooterTemplate(footerTemplate: TemplateRef<any>) {
    this.footerTemplateSource.next(footerTemplate);
  }

  changeBackdrop(enableBackdrop: boolean) {
    this.hasBackdropSource.next(enableBackdrop);
  }

  toggleDrawer(enableDrawer: boolean) {
    console.log(enableDrawer);
    this.isActiveSource.next(enableDrawer);
  }

  changeDrawerMode(drawerMode: "side" | "over" | "push") {
    this.drawerModeSource.next(drawerMode);
  }

  changeDrawerSize(
    drawerSize:
      | "extra-extra-small"
      | "extra-small"
      | "small"
      | "medium"
      | "large"
      | "extra-large"
  ) {
    this.drawerSizeSource.next(drawerSize);
  }

  setEscClose(value: boolean) {
    this.escCloseSource.next(value);
  }

  makeDrawerRightSide(isRightSide: boolean) {
    this.isRightSideSource.next(isRightSide);
  }

  setTitle(title: string) {
    this.drawerTitleSource.next(title);
  }

  showCloseButton(value: boolean) {
    this.showCloseButtonSource.next(value);
  }

  useCustomTemplate(value: boolean) {
    this.useCustomTemplateSource.next(value);
  }
}
