import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IResponseSchema } from 'src/app/configs/api-config';
import { EncryptedStorage } from '../utils/encrypted-storage';

@Injectable()
export class SearchService {
  baseUrl: string = '';
  constructor(private http: HttpClient) {
    this.baseUrl = '../../../assets/data';
  }
  
  // Searched Contract
  getAllSearchedContract(): Observable<any> {
    return this.http.get(`${this.baseUrl}/19-SearchContract.json`)
  }

  

  
}
