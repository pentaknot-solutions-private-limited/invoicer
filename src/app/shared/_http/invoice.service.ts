import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { IResponseSchema } from "src/app/configs/api-config";
import { environment } from "src/environments/environment";
import { EncryptedStorage } from "../utils/encrypted-storage";

@Injectable()
export class InvoiceService {
  baseUrl: string = "";
  liveUrl: string = "";
  constructor(private http: HttpClient) {
    this.baseUrl = "../../../assets/data";
    // this.liveUrl = "http://13.235.223.244/api";
    this.liveUrl = `${environment?.apiURL}/api`;
  }

  // Invoices Data
  getInvoices(searchFilter: any): Observable<any> {
    // console.log(searchFilter);
    // return this.http.get(`${this.baseUrl}/18-Search.json`)
    return this.http.get(`${this.liveUrl}/invoices`);
  }
  getAllPendingIRNInvoicesApi(): Observable<any> {
    return this.http.get(`${this.liveUrl}/invoices/getAllPendingIRNInvoices`);
  }
  getAllDraftInvoicesApi(): Observable<any> {
    return this.http.get(`${this.liveUrl}/invoices/getAllDraftInvoices`);
  }
  getInvoicesByQueryApi(query: string): Observable<any> {
    return this.http.get(
      `${this.liveUrl}/invoices/getInvoicesByQuery?query=${query}`
    );
  }

  getInvoiceById(id: number): Observable<any> {
    return this.http.get(`${this.liveUrl}/invoices/${id}`);
  }

  getQRCodeByInvoiceId(id: number): Observable<any> {
    return this.http.get(`${this.liveUrl}/invoices/getQRCodeById/${id}`);
  }
  getInvoicesCountApi(): Observable<any> {
    return this.http.get(`${this.liveUrl}/invoices/getInvoicesCount`);
  }
}
