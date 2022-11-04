import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IResponseSchema } from 'src/app/configs/api-config';
import { EncryptedStorage } from '../utils/encrypted-storage';

@Injectable()
export class ExtractAIService {
  baseUrl: string = '';
  constructor(private http: HttpClient) {
    this.baseUrl = '../../../assets/data';
  }

  getAllUploadedFiles(files: number): Observable<any> {
    if (files == 1) {
      return this.http.get(`${this.baseUrl}/10-Contracts_Single.json`)
    } else {
      return this.http.get(`${this.baseUrl}/10-Contracts_Multiple.json`)
    }
    
  }

  getAllCompletedFiles(files: number): Observable<any> {
    if (files == 1) {
      return this.http.get(`${this.baseUrl}/10-Contracts_Single_Complete.json`)
    } else {
      return this.http.get(`${this.baseUrl}/10-Contracts_Multiple_Complete.json`)
    }
    
  }

  getAllStepData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/11-Steps.json`)
  }
  
  // Entity And Clause Extraction
  getAllEntityAndClauseExtraction(contractId: any): Observable<any> {
    // contractId [can be used later]
    return this.http.get(`${this.baseUrl}/12-EntityClause.json`)
  }

  deletePolicies(id: any): Observable<any> {
    let res: any;
    if (id) {
      res = {data: id, message: "(Fake API) Data deleted successfully."}
    } else {
      res = {data: id, message: "Error while adding data."}
    }
    // return this.http.post(`${this.baseUrl}/UserListing.json`, payload);
    return of(res)
  }

  
}
