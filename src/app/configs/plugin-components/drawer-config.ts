import { TemplateRef } from "@angular/core";

export class DrawerPanelCONFIG {
    hasBackdrop: boolean = true;
    drawerMode: "side" | "over" | "push" = "over";
    drawerSize: "extra-extra-small" | "extra-small" | "small" | "medium" | "large" | "extra-large" = "small";
    escClose: boolean = false;
    isRightSide: boolean = true;
    isActive: boolean = false;
    drawerTitle: string;
    showCloseButton: boolean;
    drawerContainer: TemplateRef<any>;
    footerTemplate: TemplateRef<any>;
    useCustomTemplate: boolean; 
}