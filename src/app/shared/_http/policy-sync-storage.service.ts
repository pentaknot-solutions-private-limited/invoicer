import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IResponseSchema } from 'src/app/configs/api-config';
import { EncryptedStorage } from '../utils/encrypted-storage';

@Injectable()
export class PolicySyncStorageService {
  baseUrl: string = '';
  constructor(private http: HttpClient) {
    this.baseUrl = '../../../assets/data';
  }
  
  // Entity And Clause Extraction
  getAllPolicyStorageSync(contractId: any): Observable<any> {
    // contractId [can be used later]
    return this.http.get(`${this.baseUrl}/14-Storage.json`)
  }

  

  
}
