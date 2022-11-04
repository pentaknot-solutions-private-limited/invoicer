import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

@Injectable()
export class InvoiceGenerationService {
  baseUrl: string = "";
  constructor(private http: HttpClient) {
    this.baseUrl = "../../../assets/data/invoices";
  }

  //
  getMyAccountDetails(): Observable<any> {
    return this.http.get(`${this.baseUrl}/bank/account-details.json`);
  }

  // Organization
  getAllOrganization(): Observable<any> {
    return this.http.get(`${this.baseUrl}/organization-list.json`);
  }
  // Branch
  getAllBranchByOrgId(orgId: string): Observable<any> {
    // return this.http.get(`${this.baseUrl}/branch-organization-list.json`);
    return this.http.get(`${this.baseUrl}/branch-organization-list.json`);
  }

  // Customer
  getAllCustomer(): Observable<any> {
    return this.http.get(`${this.baseUrl}/customer-list.json`);
  }
  // Branch
  getAllBranchByCustomerId(customerId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/branch-customer-list.json`);
  }
}
