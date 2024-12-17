import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
}
  from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { TokenApiModel } from '../models/token-api.model';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService, private toast: NgToastService,private router: Router) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const myToken = this.auth.getToken();

    if (myToken) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${myToken}` }
      })
    }
    return next.handle(request).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.handleUnAuthorizedError(request, next);
          }
        }

        return throwError(() => new Error("Some other error accured"))
      })
    );
  }

  handleUnAuthorizedError(req: HttpRequest<any>, next: HttpHandler) {
    let tokenApiModel = new TokenApiModel();
    tokenApiModel.accessToken = this.auth.getToken()!;
    tokenApiModel.refreshToken = this.auth.getRefreshToken()!;
    return this.auth.renewToken(tokenApiModel)
      .pipe(
        switchMap((data: TokenApiModel) => {
          this.auth.storeRefreshToken(data.refreshToken);
          this.auth.storeToken(data.accessToken);
          req = req.clone({
            setHeaders: {
              Authorization: `Bearer ${data.accessToken}`}
          })
          return next.handle(req)
        }),
        catchError((err) => {
          return throwError(() => {
            this.toast.warning("Token is expired, Login again", "ERROR", 5000)
            this.router.navigate(['login'])
          })
        })
    )

  }
}
