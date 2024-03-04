import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { IResponseSchema } from "src/app/configs/api-config";
import { environment } from "src/environments/environment";
import { EncryptedStorage } from "../utils/encrypted-storage";
import { CustomerDetails } from "src/app/modules/customer/model/customer.model";

@Injectable()
export class CustomerService {
  baseUrl: string = "";
  liveUrl: string = "";
  constructor(private http: HttpClient) {
    this.baseUrl = "../../../assets/data";
    // this.liveUrl = "http://13.235.223.244/api";
    this.liveUrl = `${environment?.apiURL}`;
  }

  // Customer Data
  getAllCustomers(): Observable<any> {
    return this.http.get(
      `${this.liveUrl}/customer`
      // `${this.baseUrl}/customer/get-all-customers.json`
    );
  }

  getAddCustomerDependencies() {
    return this.http.get(`${this.liveUrl}/customer/dependencies`);
  }

  addUpdateCustomer(
    payload: CustomerDetails
  ): Observable<CustomerDetails | any> {
    return payload?._id
      ? this.http.patch(`${this.liveUrl}/customer/${payload?._id}`, payload)
      : this.http.post(`${this.liveUrl}/customer`, payload);
  }

  deleteCustomer(id: string) {
    return this.http.delete(`${this.liveUrl}/customer/${id}`);
  }
}
