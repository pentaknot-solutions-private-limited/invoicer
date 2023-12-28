import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PurchaseComponent } from "./purchase.component";
import { VSAButtonModule } from "src/app/shared/components/vsa-button/package.module";
import { AddPurchaseComponent } from "./pages/add-purchase/add-purchase.component";
import { VSAInputModule } from "src/app/shared/components/vsa-input/package.module";
import { VSASelectBoxModule } from "src/app/shared/components/vsa-select-box/package.module";
import { CustomerService } from "src/app/shared/_http/customer.service";
import { VSAGridModule } from "src/app/shared/components/vsa-grid/package.module";
import { PurchaseRoutingModule } from "./purchase-routing.module";

@NgModule({
  declarations: [PurchaseComponent, AddPurchaseComponent],
  imports: [
    CommonModule,
    PurchaseRoutingModule,
    VSAButtonModule,
    VSAInputModule,
    VSASelectBoxModule,
    VSAGridModule,
  ],
  providers: [CustomerService],
})
export class PurchaseModule {}
