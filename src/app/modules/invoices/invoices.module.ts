import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { VSAButtonModule } from "src/app/shared/components/vsa-button/package.module";
import { VSAGridModule } from "src/app/shared/components/vsa-grid/package.module";
import { VSAIconModule } from "src/app/shared/components/vsa-icon/package.module";
import { VSAInputModule } from "src/app/shared/components/vsa-input/package.module";
import { VSAModalModule } from "src/app/shared/components/vsa-modal/package.module";
import { VSANotificationModule } from "src/app/shared/components/vsa-notifications/package.module";
import { VSASelectBoxModule } from "src/app/shared/components/vsa-select-box/package.module";
import { VSAToastyModule } from "src/app/shared/components/vsa-toasty/vsa-toasty/package.module";
import { VSAToastyService } from "src/app/shared/components/vsa-toasty/vsa-toasty/vsa-toasty.service";
import { DrawerPanelService } from "src/app/shared/components/vsa-drawer-panel/src/vsa-drawer.service";
import { DashboardService } from "src/app/shared/_http/dashboard.service";
import { MaterialModule } from "src/app/shared/shared-modules/material.module";
import { InvoicesComponent } from "./invoices.component";
import { InvoiceService } from "src/app/shared/_http/invoice.service";
import { InvoiceGenerationComponent } from "./common/invoice-generation/invoice-generation.component";
import { VSAStepperModule } from "src/app/shared/components/vsa-stepper/package.module";
import { PMRStepperModule } from "src/app/shared/components/pmr-stepper/package.module";
import { InvoiceGenerationService } from "src/app/shared/_http/invoice-generation.service";
import { AutoCompleteModule } from 'primeng/autocomplete';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    VSAModalModule,
    VSANotificationModule,
    VSAIconModule,
    VSAButtonModule,
    VSAInputModule,
    VSASelectBoxModule,
    VSAGridModule,
    VSAStepperModule,
    PMRStepperModule,
    AutoCompleteModule,
    VSAToastyModule.forRoot(),
    RouterModule.forChild([
      {
        path: "",
        component: InvoicesComponent,
        pathMatch: "full",
      },
      {
        path: "invoices",
        component: InvoicesComponent,
      },
    ]),
  ],
  declarations: [InvoicesComponent, InvoiceGenerationComponent],
  providers: [
    VSAToastyService,
    InvoiceService,
    DrawerPanelService,
    InvoiceGenerationService,
    DashboardService,
  ],
})
export class InvoicesModule {}
