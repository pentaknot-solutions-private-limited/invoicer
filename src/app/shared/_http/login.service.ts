import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { IResponseSchema } from "src/app/configs/api-config";
import { EncryptedStorage } from "../utils/encrypted-storage";
import * as CryptoJS from "crypto-js";
import { environment } from "src/environments/environment";

@Injectable()
export class LoginService {
  baseUrl: string = "";
  liveURL: any;
  // secretKey = "YourSecretKeyForEncryption&Descryption";
  constructor(private http: HttpClient) {
    this.baseUrl = "../../../assets/data";
    this.liveURL = environment.apiURL;
  }

  // encrypt(value : string) : string{
  //   return CryptoJS.AES.encrypt(value, this.secretKey.trim()).toString();
  // }

  // decrypt(textToDecrypt : string){
  //   return CryptoJS.AES.decrypt(textToDecrypt, this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
  // }

  loginDetails(): Observable<any> {
    return this.http.get(`${this.baseUrl}/1-Logins.json`);
    // visa-contract-ai-frontend/Source/src/assets/data/1-Logins.json
  }

  login(username: any, password: any): Observable<any> {
    return this.http.post(`${this.liveURL}/auth/login`, { username, password });
  }

  loginOLD(payLoad: any, loginCredentials: any[]): Observable<any> {
    let res: IResponseSchema | any = {};
    const data = loginCredentials.find(
      (item: any) => item.email == payLoad.emailId
    );
    if (
      data &&
      data.email == payLoad.emailId &&
      data.password == payLoad.password
    ) {
      data.loginTime = new Date().toLocaleString();
      res = { message: "Logged In Successfully!", data: data };
      // Persist Logged In user data
      new EncryptedStorage().setItem("_vsa-u", JSON.stringify(data), true);
    } else {
      res = { message: "Invalid Credentials!", error: "Invalid Credentials!" };
    }
    return of(res);
  }

  getSidebarMenu(isAdmin: boolean): Observable<any> {
    if (isAdmin) {
      return this.http.get(`${this.baseUrl}/navigation/admin-nav.json`);
    } else {
      return this.http.get(`${this.baseUrl}/navigation/user-nav.json`);
    }
  }

  confirmTemporaryPassword(payload: any): Observable<any> {
    let res: any;
    if (payload) {
      res = {
        data: payload,
        message: "(Fake API) Temporary Password matched successfully.",
      };
    } else {
      res = { data: payload, message: "Error while matching password." };
    }
    return of(res);
  }

  createNewPassword(payload: any): Observable<any> {
    let res: any;
    if (payload) {
      res = {
        data: payload,
        message: "(Fake API) New Password created successfully.",
      };
    } else {
      res = { data: payload, message: "Error while creating new password." };
    }
    return of(res);
  }
}
