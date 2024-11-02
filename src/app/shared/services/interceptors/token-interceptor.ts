import {Injectable} from '@angular/core';
import {catchError, switchMap} from 'rxjs/operators';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserService} from "../api/user-service";
import {UserEventsService} from "../events/user-events-service";
import {TokenService} from "../tools/token-service";
import {Router} from "@angular/router";
import {ResponseHandler} from "../tools/response-handler";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private userService: UserService,
    private userEventsService: UserEventsService,
    private tokenService: TokenService,
    private router: Router,
    private responseHandler: ResponseHandler
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.userService.tryRefreshTokens().pipe(
            switchMap((response: any) => {
              if(response.isSuccessful) {
                this.userEventsService.sendSuccessfulLoginNotification(response.result);
                let headers: HttpHeaders = this.tokenService.createHeaders();
                request = request.clone({
                  headers: headers
                });
                return next.handle(request);
              }
              else {
                this.userEventsService.sendLogoutNotification();
                return this.router.navigate(['bricks_manager/login']).then(
                  () => this.responseHandler.errorFromServerResponse(response));
              }
            }),
            catchError((error: HttpErrorResponse) => {
              this.userEventsService.sendLogoutNotification();
              throw(error);
            }));
        }
        else {
          throw(error);
        }
      }));
  }
}
