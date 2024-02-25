import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { VSAButtonModule } from "src/app/shared/components/vsa-button/package.module";
import { VSAInputModule } from "src/app/shared/components/vsa-input/package.module";
import { VSASelectBoxModule } from "src/app/shared/components/vsa-select-box/package.module";
import { CustomerService } from "src/app/shared/_http/customer.service";
import { VSAGridModule } from "src/app/shared/components/vsa-grid/package.module";
import { SaleComponent } from "./sale.component";
import { AddSaleComponent } from "./pages/add-sale/add-sale.component";
import { SaleRoutingModule } from "./sale-routing.module";
import { InventoryService } from "src/app/shared/_http/inventory.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { VSAIconModule } from "src/app/shared/components/vsa-icon/package.module";
import { SaleService } from "src/app/shared/_http/sale.service";
import { RecordPaymentComponent } from './pages/record-payment/record-payment.component';
import { PaymentScheduleComponent } from "./pages/payment-schedule/payment-schedule.component";

@NgModule({
  declarations: [SaleComponent, AddSaleComponent, RecordPaymentComponent, PaymentScheduleComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SaleRoutingModule,
    VSAButtonModule,
    VSAInputModule,
    VSAIconModule,
    VSASelectBoxModule,
    VSAGridModule,
  ],
  providers: [CustomerService, InventoryService, SaleService],
})
export class SaleModule {}
