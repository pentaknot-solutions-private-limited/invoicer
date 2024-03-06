import { BreakpointObserver } from "@angular/cdk/layout";
import {
  AfterViewInit,
  Component,
  ContentChild,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { GlobalConfig } from "src/app/configs/global-config";
import { EncryptedStorage } from "src/app/shared/utils/encrypted-storage";
import { ChangeSubheaderParameterService } from "src/app/shared/_global/subheader.service";
import { LoginService } from "src/app/shared/_http/login.service";
import { MaterialModule } from "../../../shared/shared-modules/material.module";
import { DrawerPanelCONFIG } from "src/app/configs/plugin-components/drawer-config";
import { MatSidenav } from "@angular/material/sidenav";
import { DrawerPanelService } from "src/app/shared/components/vsa-drawer-panel/src/vsa-drawer.service";

@Component({
  selector: "navigation-layout",
  templateUrl: "./navigation-layout.component.html",
  styleUrls: ["./navigation-layout.component.scss"],
  providers: [
    ChangeSubheaderParameterService,
    LoginService,
    DrawerPanelService,
  ],
})
export class NavigationLayoutComponent implements OnInit, AfterViewInit {
  @ViewChild("sidenav") sidenav: MatSidenav;
  @ViewChild("drawerTemplate") drawerTemplate: TemplateRef<any>;

  @Input() template?: TemplateRef<any>;
  @Input() title?: string;
  @Input() sideBarToggle?: boolean = true;

  loading: boolean = false;
  sideBarClose = "sidebar-is-reduced";
  sideBarOpen = "sidebar-is-expanded";
  menuList = [];
  loggedInUserData: any;
  bottomList: any;
  drawerPanelConfig = new DrawerPanelCONFIG();
  pageComponentVisibility = {
    notifications: false,
    profile: false,
    settings: false,
  };
  constructor(
    public router: Router,
    private breakPointObs: BreakpointObserver,
    private subheaderService: ChangeSubheaderParameterService,
    private loginService: LoginService,
    private drawerControllerService: DrawerPanelService
  ) {
    const data = new EncryptedStorage().findItemFromAllStorage("_vsa-u");
    // Get all data from local storage
    this.loggedInUserData = JSON.parse(data);
    // If the user is not Admin after login & tries to access the team module it will automatically redirect to dashboard page
    const exist = router.routerState.snapshot.url.includes("dashboard");
    if (exist && !this.loggedInUserData.isAdmin) {
      this.router.navigate(["dashboard"]);
    }

    // Function for getting left sidebar/menu data
    this.getSidebarMenu(this.loggedInUserData.isAdmin);

    router.events.subscribe((event) => {
      switch (true) {
        case event instanceof NavigationStart:
          // Turn on Page Loading
          this.loading = true;
          break;
        case event instanceof NavigationError:
        case event instanceof NavigationCancel:
        case event instanceof NavigationEnd:
          // Turn off Page Loading
          this.loading = false;
          // this.setupSubHeaderForNav(this.router.url.split('?')[0]);
          this.subheaderChangeDetection();

          break;
        default:
          break;
      }
    });
  }

  ngOnInit(): void {
    // Below function is called for responsive view
    this.responsiveView();
    this.setupDrawerControllers();
  }

  ngAfterViewInit() {}

  ngOnChanges() {}

  OnLogoutClick() {
    new EncryptedStorage().clearAll();
    this.router.navigate([new GlobalConfig().loginRoute]);
  }

  drawerTest(event) {
    console.log(event);
  }

  setupDrawerControllers() {
    this.drawerControllerService.isActive$.subscribe((response) => {
      this.drawerPanelConfig.isActive = response;
    });
    this.drawerControllerService.hasBackdrop$.subscribe(
      (response) => (this.drawerPanelConfig.hasBackdrop = response)
    );
    this.drawerControllerService.drawerMode$.subscribe(
      (response) => (this.drawerPanelConfig.drawerMode = response)
    );
    this.drawerControllerService.drawerSize$.subscribe(
      (response) => (this.drawerPanelConfig.drawerSize = response)
    );
    this.drawerControllerService.drawerContainer$.subscribe(
      (response) => (this.drawerPanelConfig.drawerContainer = response)
    );
    this.drawerControllerService.escClose$.subscribe(
      (response) => (this.drawerPanelConfig.escClose = response)
    );
    this.drawerControllerService.isRightSide$.subscribe(
      (response) => (this.drawerPanelConfig.isRightSide = response)
    );
    this.drawerControllerService.drawerTitle$.subscribe(
      (response) => (this.drawerPanelConfig.drawerTitle = response)
    );
    this.drawerControllerService.showCloseButton$.subscribe(
      (response) => (this.drawerPanelConfig.showCloseButton = response)
    );
    this.drawerControllerService.useCustomTemplate$.subscribe(
      (response) => (this.drawerPanelConfig.useCustomTemplate = response)
    );
    this.drawerControllerService.footerTemplate$.subscribe(
      (response) => (this.drawerPanelConfig.footerTemplate = response)
    );
  }

  drawerActiveChange(isActive) {
    // This function is used to change active state of drawer on escape
    // Function has been removed from usage, it was creating drawer loop
    // Escape close feature is set has disabled
    this.drawerPanelConfig.isActive = isActive;
    this.drawerControllerService.toggleDrawer(isActive);
  }

  subheaderChangeDetection() {
    this.subheaderService.titleObservable().subscribe((response) => {
      this.title = response;
    });
    this.subheaderService
      .templateObservable()
      .subscribe((response) => (this.template = response));
    this.subheaderService
      .sidebarToggleObservable()
      .subscribe((response) => (this.sideBarToggle = response));
  }

  onModuleClicked(item: any) {
    this.menuList.forEach((element) => {
      if (item == element) {
        element.isActive = true;
        this.router.navigate([element.route]);
      } else {
        element.isActive = false;
      }
    });
  }

  onBottomMenuClicked(item: any) {
    // this.menuList.forEach((element) => {
    //   element.isActive = false;
    // });
    this.bottomList.forEach((element, index) => {
      if (item.name == element.name) {
        switch (item.id) {
          case 1:
            this.openDrawer("notifications");
            break;

          case 2:
            this.openDrawer("settings");
            break;

          case 3:
            this.openDrawer("profile");
            break;

          case 4:
            new EncryptedStorage().clearAll();
            this.router.navigate([new GlobalConfig().loginRoute]);
            break;

          default:
            break;
        }
      } else {
        // element.isActive = false;
      }
    });
  }

  // Drawer Action
  openDrawer(drawerCase: string) {
    this.drawerControllerService.useCustomTemplate(false);
    switch (drawerCase) {
      case "notifications":
        this.pageComponentVisibility.notifications = true;
        this.drawerControllerService.createContainer(this.drawerTemplate);
        this.drawerControllerService.toggleDrawer(true);
        this.drawerControllerService.setEscClose(false);
        this.drawerControllerService.setTitle("Notifications");
        this.drawerControllerService.changeDrawerSize("extra-small");
        break;
      case "profile":
        this.pageComponentVisibility.profile = true;
        this.drawerControllerService.createContainer(this.drawerTemplate);
        this.drawerControllerService.toggleDrawer(true);
        this.drawerControllerService.showCloseButton(false);
        this.drawerControllerService.setEscClose(false);
        this.drawerControllerService.setTitle("Profile");
        this.drawerControllerService.changeDrawerSize("extra-extra-small");
        break;
      case "settings":
        this.pageComponentVisibility.settings = true;
        this.drawerControllerService.createContainer(this.drawerTemplate);
        this.drawerControllerService.toggleDrawer(true);
        this.drawerControllerService.showCloseButton(false);
        this.drawerControllerService.setEscClose(false);
        this.drawerControllerService.setTitle("Settings");
        this.drawerControllerService.changeDrawerSize("extra-small");
        break;
      default:
        break;
    }
  }

  drawerAction(event) {
    this.clearDrawerData();
  }

  clearDrawerData() {
    this.drawerControllerService.toggleDrawer(false);
    this.drawerControllerService.setEscClose(false);
    this.drawerControllerService.setTitle(null);
    this.closeAllDrawerComponent();
  }

  closeAllDrawerComponent() {
    // Loop through all component and hide
    for (const item in this.pageComponentVisibility) {
      this.pageComponentVisibility[item] = false;
    }
  }

  responsiveView() {
    const queries = [
      "(min-width: 1278px)",
      "(min-width: 1193px) and (max-width: 1276px)",
      "(min-width: 1013px) and (max-width: 1192px)",
      "(min-width: 885px) and (max-width: 1012px)",
      "(min-width: 757px) and (max-width: 884px)",
      "(min-width: 650px) and (max-width: 756px)",
      "(min-width: 571px) and (max-width: 649px)",
      "(min-width: 480px) and (max-width: 570px)",
      "(min-width: 200px) and (max-width: 479px)",
    ];
    this.breakPointObs.observe(queries).subscribe((response) => {
      for (const query of Object.keys(response.breakpoints)) {
        if (response.breakpoints[queries[6]]) {
          this.sideBarToggle = true;
        } else if (response.breakpoints[queries[7]]) {
          this.sideBarToggle = true;
        } else if (response.breakpoints[queries[8]]) {
          this.sideBarToggle = true;
        } else if (response.breakpoints[queries[5]]) {
          this.sideBarToggle = true;
        } else if (response.breakpoints[queries[4]]) {
          this.sideBarToggle = true;
        } else if (response.breakpoints[queries[3]]) {
          this.sideBarToggle = true;
        } else if (response.breakpoints[queries[2]]) {
          this.sideBarToggle = true;
        } else {
          if (this.router.url.includes("review")) {
            this.sideBarToggle = true;
          } else {
            this.sideBarToggle = this.sideBarToggle;
          }
        }
      }
    });
  }

  // API Calls
  getSidebarMenu(isAdmin: boolean) {
    this.loginService.getSidebarMenu(isAdmin).subscribe((res: any) => {
      if (res) {
        // Storing the sidebar data into "menuList" variable
        this.menuList = res[0].top;
        this.bottomList = res[0].bottom;
        // If the user is admin below if condition will be true
        if (this.router.url.includes("customer")) {
          this.menuList[0].isActive = true;
        } else if (this.router.url.includes("sale")) {
          this.menuList[1].isActive = true;
        } else if (this.router.url.includes("purchase")) {
          this.menuList[2].isActive = true;
        } else if (this.router.url.includes("mechanical")) {
          this.menuList[0].isActive = true;
        } else if (this.router.url.includes("expense")) {
          this.menuList[3].isActive = true;
        } 
        // else if (this.router.url.includes("reports")) {
        //   this.menuList[4].isActive = true;
        // } 
        else {
          this.menuList[1].isActive = true;
        }
        // else if (this.router.url.includes("project")) {
        //   this.menuList[1].isActive = true;
        // } else if (this.router.url.includes("archive")) {
        //   this.menuList[2].isActive = true;
        // } else if (this.router.url.includes("reports")) {
        //   this.menuList[3].isActive = true;
        // } else {
        //   this.menuList[0].isActive = true;
        // }
      }
    });
  }
}
