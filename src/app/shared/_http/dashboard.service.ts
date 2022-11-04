import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { IResponseSchema } from "src/app/configs/api-config";
import { EncryptedStorage } from "../utils/encrypted-storage";

@Injectable()
export class DashboardService {
  baseUrl: string = "";
  constructor(private http: HttpClient) {
    this.baseUrl = "../../../assets/data";
  }

  getAllTeam(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Team.json`);
  }

  getAllStatisticsData(event?: any): Observable<any> {
    // if (event) {
    //   if (event.timeId == '1') {
    //     return this.http.get(`${this.baseUrl}/6-DashBoard1.json`)
    //   } else {
    //     return this.http.get(`${this.baseUrl}/6-DashBoard2.json`)
    //   }
    // } else {
    // return this.http.get(`${this.baseUrl}/6-DashBoard1.json`)
    // }
    return this.http.get(`${this.baseUrl}/SampleDashboard.json`);
  }

  getContractByAffiliates(event?: any): Observable<any> {
    // return this.http.get(`${this.baseUrl}/7-DashBoard_Affiliates.json`)
    if (event) {
      if (event.timeId == "1") {
        return this.http.get(`${this.baseUrl}/7-DashBoard_Affiliates.json`);
      } else {
        return this.http.get(`${this.baseUrl}/7-DashBoard_Affiliates1.json`);
      }
    } else {
      return this.http.get(`${this.baseUrl}/7-DashBoard_Affiliates.json`);
    }
  }

  getContractByProducts(event?: any): Observable<any> {
    // return this.http.get(`${this.baseUrl}/8-DashBoard_Product.json`)
    if (event) {
      if (event.timeId == "1") {
        return this.http.get(`${this.baseUrl}/8-DashBoard_Product.json`);
      } else {
        return this.http.get(`${this.baseUrl}/8-DashBoard_Product2.json`);
      }
    } else {
      return this.http.get(`${this.baseUrl}/8-DashBoard_Product.json`);
    }
  }

  getContractByClientType(event?: any): Observable<any> {
    // return this.http.get(`${this.baseUrl}/9-DashBoard_ClientType.json`)
    if (event) {
      if (event.timeId == "1") {
        return this.http.get(`${this.baseUrl}/9-DashBoard_ClientType.json`);
      } else {
        return this.http.get(`${this.baseUrl}/9-DashBoard_ClientType2.json`);
      }
    } else {
      return this.http.get(`${this.baseUrl}/9-DashBoard_ClientType.json`);
    }
  }

  getAllUserData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/UserListing.json`);
  }

  getAllPeriodFilterData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Periods.json`);
  }
}
