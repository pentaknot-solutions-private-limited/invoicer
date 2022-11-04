import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable()
export class VSAFileUploaderService {
    baseUrl: string;
    userData: any;
    orgId: any;
    userId: any;
    constructor(private httpClient: HttpClient) {
        // this.baseUrl = environment.apiUrl;
        this.baseUrl = "http://localhost:8080/backend";
    }


    uploadFile(file: FormData): Observable<any> {
        return this.httpClient.post(`${this.baseUrl}/upload-file`, file, { reportProgress: true, observe: 'events' });
    }

}
