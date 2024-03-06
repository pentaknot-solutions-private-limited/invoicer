import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { IResponseSchema } from "src/app/configs/api-config";
import { environment } from "src/environments/environment";
import { EncryptedStorage } from "../utils/encrypted-storage";

@Injectable()
export class InventoryService {
  baseUrl: string = "";
  liveUrl: string = "";
  constructor(private http: HttpClient) {
    // this.baseUrl = "../../../assets/data";
    // this.liveUrl = "http://13.235.223.244/api";
    this.liveUrl = `https://api.wishwheels.com/api`;
  }

  // Customer Data
  getAllInventory(): Observable<any> {
    return this.http.get(
      // `${this.liveUrl}/invoices`
      `${this.liveUrl}/car/complete/car/detail`
    );
  }

  getInventoryById(id: any): Observable<any> {
    return this.http.get(`${this.liveUrl}/car/completeCarDetailById/${id}`);
  }
}
