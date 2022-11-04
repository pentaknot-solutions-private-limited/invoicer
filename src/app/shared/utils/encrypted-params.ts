import * as CryptoJS from 'crypto-js';

export class EncryptionData {
    
    private encryptionKey: string;
    constructor() {
        this.encryptionKey = "ABCD1234565345@#@#@#@#@#";
    }
    
    public encryptData(value) {
        return this.encrypt(this.encryptionKey, value);
    }

    public decryptData(encryptedValue) {
        return this.decrypt(this.encryptionKey, encryptedValue);
    }

    // Encryption and Decryption
    private encrypt(keys, value){
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
      private decrypt(keys, value){ 
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