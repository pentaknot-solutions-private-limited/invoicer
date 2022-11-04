import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IResponseSchema } from 'src/app/configs/api-config';
import { EncryptedStorage } from '../utils/encrypted-storage';

@Injectable()
export class InvoiceService {
  baseUrl: string = '';
  constructor(private http: HttpClient) {
    this.baseUrl = '../../../assets/data';
  }
  
  // Invoices Data
  getInvoices(searchFilter: any): Observable<any> {
    // console.log(searchFilter);
    // return this.http.get(`${this.baseUrl}/18-Search.json`)
    return this.http.get(`${this.baseUrl}/Invoices-${searchFilter!.filter}.json`)
  }

  

  
}
