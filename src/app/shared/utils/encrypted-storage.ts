import * as CryptoJS from 'crypto-js';

export class EncryptedStorage {
    
    private encryptionKey: string;
    constructor() {
        this.encryptionKey = "ABCD1234565345@#@#@#@#@#";
    }
    
    public setItem(key: string, data: any, useSession = false) {
        if(!useSession) {
            localStorage.setItem(key, this.encrypt(this.encryptionKey, data));
        } else {
            sessionStorage.setItem(key, this.encrypt(this.encryptionKey, data));
        }
    }
    
    public getItem(key: string, useSession = false): string | any {
        if(!useSession) {
            return this.decrypt(this.encryptionKey, localStorage.getItem(key));
        } else {
            return this.decrypt(this.encryptionKey, sessionStorage.getItem(key));
        }
    }

    public findItemFromAllStorage(key: string): string | any {
        if(this.decrypt(this.encryptionKey, localStorage.getItem(key))) {
            return this.decrypt(this.encryptionKey, localStorage.getItem(key));
        } else {
            return this.decrypt(this.encryptionKey, sessionStorage.getItem(key));
        }
    }

    public removeItemFromAllStorage(key:any) {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
    }
    public removeItemFromSessionStorage(key:any) {
        sessionStorage.removeItem(key);
    }
    public removeItemFromLocalStorage(key:any) {
        localStorage.removeItem(key);
    }

    public clearAll() {
        localStorage.clear();
        sessionStorage.clear();
    }
    public clearLocalStorage() {
        localStorage.clear();
    }
    public clearSessionStorage() {
        sessionStorage.clear();
    }


    // Encryption and Decryption
    private encrypt(keys:any, value:any){
        var key = CryptoJS.enc.Utf8.parse(keys);
        var iv = CryptoJS.enc.Utf8.parse(keys);
        var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
        {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
    
        return encrypted.toString();
      }
    
      //The get method is use for decrypt the value.
      private decrypt(keys:any, value:any){ 
          if(value) {
            var key = CryptoJS.enc.Utf8.parse(keys);
            var iv = CryptoJS.enc.Utf8.parse(keys);
            var decrypted = CryptoJS.AES.decrypt(value, key, {
                keySize: 128 / 8,
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
        
            return decrypted.toString(CryptoJS.enc.Utf8);
          } else {
              return null
          }
       
      }
}