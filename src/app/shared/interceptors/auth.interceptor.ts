import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpResponse,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {
  map,
  filter,
  catchError,
  retryWhen,
  tap,
  finalize,
} from 'rxjs/operators';
import { GlobalConfig } from 'src/app/configs/global-config';
import { EncryptedStorage } from '../utils/encrypted-storage';
import { Router } from '@angular/router';
import { VSAToastyService } from '../components/vsa-toasty/vsa-toasty/vsa-toasty.service';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private toastyService: VSAToastyService
  ) {}
  intercept(
    httpRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let time = 0;
    const Authorization = new EncryptedStorage().findItemFromAllStorage(
      new GlobalConfig().authTokenLSName
    );
    if (Authorization) {
      let timer = setInterval(() => {
        time += 1;
        if (time >= 5) {
          this.toastyService.clear();
          this.toastyService.info(
            'Please Wait, Server is taking time more than expected',
            null,
            { positionClass: 'toast-bottom-right', closeButton: true }
          );
          clearInterval(timer);
        }
      }, 1000);
      httpRequest = httpRequest.clone({ setHeaders: { Authorization } });
      return next.handle(httpRequest).pipe(
        finalize(() => {
          clearInterval(timer);
        }),
        catchError((err) => {
          clearInterval(timer);
          // console.log(err);
          if (err instanceof HttpErrorResponse) {
            if (err.status === 403) {
              this.toastyService.error(
                'Your session is timeout, please login again.',
                null,
                { positionClass: 'toast-bottom-right' }
              );
              new EncryptedStorage().removeItemFromAllStorage(
                new GlobalConfig().authTokenLSName
              );
              this.router.navigate([new GlobalConfig().loginRoute]);
            } else if (err.status === 504) {
              this.toastyService.error('API Gateway Error', null, {
                positionClass: 'toast-bottom-center',
              });
            }
          }
          return throwError(err);
        })
      );
    } else {
      return next.handle(httpRequest).pipe(
        catchError((err) => {
          // console.log(err);
          if (err instanceof HttpErrorResponse) {
            if (err.status === 403) {
              this.toastyService.error(
                'Your session is timeout, please login again.',
                null,
                { positionClass: 'toast-bottom-right' }
              );
              new EncryptedStorage().removeItemFromAllStorage(
                new GlobalConfig().authTokenLSName
              );
              this.router.navigate([new GlobalConfig().loginRoute]);
            } else if (err.status === 504) {
              // this.toastyService.error("API Gateway Error", null, {positionClass: 'toast-bottom-center'});
            }
          }
          return throwError(err);
          // return new Observable<HttpEvent<any>>();
        })
      );
    }
  }

  // intercept(request: HttpRequest<any>, next: HttpHandler) {
  //   if (request.url.includes("login"))
  //     return next.handle(request);

  //   let token = localStorage.getItem("token");
  //   const headers = new HttpHeaders({
  //     'Authorization': 'token 123',
  //     'Content-Type': 'application/json'
  //   });
  //   const url = `${request.url}&api_key=xyZapiKeyExample`;
  //   const newRequest = request.clone({headers, url});

  //   return next.handle(newRequest);
  // }
}
