import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { SaleService } from "../_http/sale.service";

@Injectable({
  providedIn: "root",
})
export class SaleResolver implements Resolve<any> {
  constructor(private saleService: SaleService) {}

  resolve(): Observable<any> | Promise<any> | any {
    return this.saleService.getDependencies(); // Implement your data retrieval logic here
  }
}
