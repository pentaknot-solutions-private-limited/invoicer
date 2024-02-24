import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CustomerRoutingModule } from "./customer-routing.module";
import { CustomerComponent } from "./customer.component";
import { VSAButtonModule } from "src/app/shared/components/vsa-button/package.module";
import { AddCustomerComponent } from "./pages/add-customer/add-customer.component";
import { VSAInputModule } from "src/app/shared/components/vsa-input/package.module";
import { VSASelectBoxModule } from "src/app/shared/components/vsa-select-box/package.module";
import { CustomerService } from "src/app/shared/_http/customer.service";
import { VSAGridModule } from "src/app/shared/components/vsa-grid/package.module";
import { VSARadioModule } from "src/app/shared/components/vsa-radio/package.module";

@NgModule({
  declarations: [CustomerComponent, AddCustomerComponent],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    VSAButtonModule,
    VSAInputModule,
    VSASelectBoxModule,
    VSARadioModule,
    VSAGridModule,
  ],
  providers: [CustomerService],
})
export class CustomerModule {}
