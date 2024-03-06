import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { IResponseSchema } from "src/app/configs/api-config";
import { environment } from "src/environments/environment";
import { EncryptedStorage } from "../utils/encrypted-storage";
import { SaleDetails } from "src/app/modules/sale/model/sale.model";

@Injectable()
export class SaleService {
  baseUrl: string = "";
  liveUrl: string = "";
  constructor(private http: HttpClient) {
    this.baseUrl = "../../../assets/data/sale";
    // this.liveUrl = "http://13.235.223.244/api";
    this.liveUrl = `${environment?.apiURL}`;
  }

  // Customer Data
  getAllSales(): Observable<any> {
    return this.http.get(
      `${this.liveUrl}/sale`
      // `${this.baseUrl}/get-all-sales.json`
    );
  }

  getDependencies(): Observable<any> {
    return this.http.get(`${this.liveUrl}/sale/dependencies`);
  }

  addUpdateSale(payload: SaleDetails): Observable<SaleDetails | any> {
    return payload?._id
      ? this.http.patch(`${this.liveUrl}/sale/${payload?._id}`, payload)
      : this.http.post(`${this.liveUrl}/sale`, payload);
  }
}
