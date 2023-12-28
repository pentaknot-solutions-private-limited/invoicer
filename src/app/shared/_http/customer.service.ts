import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { IResponseSchema } from "src/app/configs/api-config";
import { environment } from "src/environments/environment";
import { EncryptedStorage } from "../utils/encrypted-storage";

@Injectable()
export class CustomerService {
  baseUrl: string = "";
  liveUrl: string = "";
  constructor(private http: HttpClient) {
    this.baseUrl = "../../../assets/data";
    // this.liveUrl = "http://13.235.223.244/api";
    this.liveUrl = `${environment?.apiURL}/api`;
  }

  // Customer Data
  getAllCustomers(): Observable<any> {
    
    return this.http.get(
      // `${this.liveUrl}/invoices`
      `${this.baseUrl}/customer/get-all-customers.json`
      );
  }
}
