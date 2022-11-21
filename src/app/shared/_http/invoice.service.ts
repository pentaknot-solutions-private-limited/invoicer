import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IResponseSchema } from 'src/app/configs/api-config';
import { EncryptedStorage } from '../utils/encrypted-storage';

@Injectable()
export class InvoiceService {
  baseUrl: string = '';
  liveUrl: string = "";
  constructor(private http: HttpClient) {
    this.baseUrl = '../../../assets/data';
    this.liveUrl = "http://13.235.223.244/api";
  }
  
  // Invoices Data
  getInvoices(searchFilter: any): Observable<any> {
    // console.log(searchFilter);
    // return this.http.get(`${this.baseUrl}/18-Search.json`)
    return this.http.get(`${this.liveUrl}/invoices`);
  }

  

  
}
