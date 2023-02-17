import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class InvoiceGenerationService {
  baseUrl: string = "";
  liveUrl: string = "";
  irnApi: string = "";
  constructor(private http: HttpClient) {
    this.baseUrl = "../../../assets/data/invoices";
    this.liveUrl = `${environment?.apiURL}/api`;
    this.irnApi = `${environment?.IRN_GENERATION_API_ENDPOINT}/`;
    // this.liveUrl = "http://13.235.223.244/api";
  }

  //
  getMyAccountDetails(): Observable<any> {
    // return this.http.get(`${this.baseUrl}/bank/account-details.json`);
    return this.http.get(`${this.liveUrl}/bankDetails`);
    // bankDetails
  }

  // Organization
  getAllOrganization(): Observable<any> {
    // return this.http.get(`${this.baseUrl}/organization-list.json`);
    return this.http.get(`${this.liveUrl}/organizations`);
  }
  // Branch
  getAllBranchByOrgId(orgId: string): Observable<any> {
    // return this.http.get(`${this.baseUrl}/branch-organization-list.json`);
    // return this.http.get(`${this.baseUrl}/branch-organization-list.json`);
    return this.http.get(`${this.liveUrl}/organizationBranches`);
  }

  // Customer
  getAllCustomer(): Observable<any> {
    // return this.http.get(`${this.baseUrl}/customer-list.json`);
    return this.http.get(`${this.liveUrl}/customers`);
  }

  // cargoTypes
  getAllCargoTypes(): Observable<any> {
    // return this.http.get(`${this.baseUrl}/customer-list.json`);
    return this.http.get(`${this.liveUrl}/cargoTypes`);
  }

  // cargoTypes
  getAllAirlines(): Observable<any> {
    // return this.http.get(`${this.baseUrl}/customer-list.json`);
    return this.http.get(`${this.liveUrl}/airlines`);
  }

  // Service Type
  getAllServiceType(): Observable<any> {
    // return this.http.get(`${this.baseUrl}/customer-list.json`);
    return this.http.get(`${this.liveUrl}/serviceTypes`);
  }

  // Service Type
  getAllCurrency(): Observable<any> {
    // return this.http.get(`${this.baseUrl}/customer-list.json`);
    return this.http.get(`${this.liveUrl}/currencies`);
  }

  // Branch
  getAllBranchByCustomerId(customerId: string): Observable<any> {
    // return this.http.get(`${this.baseUrl}/branch-customer-list.json`);
    return this.http.get(`${this.liveUrl}/customerBranches`);
    // }
  }

  // Consginment Details
  getAllShippers(): Observable<any> {
    // return this.http.get(`${this.baseUrl}/customer-list.json`);
    return this.http.get(`${this.liveUrl}/shippers`);
  }

  getAllConsignees(): Observable<any> {
    // return this.http.get(`${this.baseUrl}/customer-list.json`);
    return this.http.get(`${this.liveUrl}/consignees`);
  }

  getAllPorts(): Observable<any> {
    // return this.http.get(`${this.baseUrl}/customer-list.json`);
    return this.http.get(`${this.liveUrl}/ports`);
  }

  addUpdateInvoice(data: any): Observable<any> {
    if (data.id) {
      // Update query
      return this.http.put(`${this.liveUrl}/invoices/${data.id}`, data);
    } else {
      // Add Query
      return this.http.post(`${this.liveUrl}/invoices`, data);
    }
  }

  // All Countries Data
  getAllCountriesData() {
    return this.http.get<any>(`${this.liveUrl}/countries`);
  }

  // Unit data
  getAllUnitData() {
    return this.http.get(`${this.liveUrl}/units`);
  }

  // Auth Token For IRN
  generateIRN(payload) {
    return this.http.post(`${this.irnApi}generateIRN`,payload);
  }

  cancelIRN(payload) {
    return this.http.post(`${this.irnApi}cancelIRN`,payload);
  }

  updateCancelIRNInvoice(id) {
    return this.http.put(`${this.liveUrl}/invoices/cancelIRNGeneration/${id}`,{});
  }

  generateAuthToken(payload) {
    return this.http.get(`${this.irnApi}getToken`,payload);// 
  }
}
