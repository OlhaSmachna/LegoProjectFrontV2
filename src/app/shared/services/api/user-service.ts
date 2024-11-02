import {Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {LoginRequestUserDto} from "../../DTOs/User/login-request-user.dto";
import {AddRequestUserDto} from "../../DTOs/User/add-request-user.dto";
import {Observable, Subscriber} from "rxjs";
import {ApiServiceResponse} from "../../DTOs/api-service-response";
import {TokenService} from "../tools/token-service";
import {RefreshTokenRequestUserDto} from "../../DTOs/User/refresh-token-request-user.dto";
import {BackendAddress} from "./BackendAddress";
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly RegisterURL: string = '/Users';
  private readonly LoginURL: string = '/Users/Login';
  private readonly RefreshURL: string = '/Users/Refresh';

  constructor(
    private client: HttpClient,
    private tokenService: TokenService,
    private backend: BackendAddress) {
    this.RegisterURL = backend.get() + this.RegisterURL;
    this.LoginURL = backend.get() + this.LoginURL;
    this.RefreshURL = backend.get() + this.RefreshURL;
  }

  public register(user:AddRequestUserDto):Observable<ApiServiceResponse> {
    return this.client.post<ApiServiceResponse>(this.RegisterURL,user);
  }

  public login(user:LoginRequestUserDto):Observable<ApiServiceResponse>{
    return this.client.post<ApiServiceResponse>(this.LoginURL,user);
  }

  public tryRefreshTokens():Observable<ApiServiceResponse>{
    if(this.tokenService.refreshTokenIsValid())
    {
      const refreshTokenRequestUserDto: RefreshTokenRequestUserDto = {
        email: localStorage.getItem('user')??'',
        token: localStorage.getItem('token')??'',
        refreshToken: localStorage.getItem('refreshToken')??''
      }
      return this.client.post<ApiServiceResponse>(this.RefreshURL, refreshTokenRequestUserDto);
    }
    else{
      return new Observable<ApiServiceResponse>((subscriber: Subscriber<ApiServiceResponse>) =>
        subscriber.next(this.tokenService.missingTokenResponse));
    }
  }
}
