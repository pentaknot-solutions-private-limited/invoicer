import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SaleComponent } from "./sale.component";
import { AddSaleComponent } from "./pages/add-sale/add-sale.component";
import { SaleResolver } from "src/app/shared/resolvers/sale.resolver";

const routes: Routes = [
  {
    path: "",
    component: SaleComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SaleRoutingModule {}
