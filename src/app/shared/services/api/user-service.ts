import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthRequestUserDto} from "../../models/DTOs/User/auth_request_user_dto";
import {AuthResponseUserDto} from "../../models/DTOs/User/auth_response_user_dto";
import {RegRequestUserDto} from "../../models/DTOs/User/reg_request_user_dto";
import {RegResponseUserDto} from "../../models/DTOs/User/reg_response_user_dto";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {ApiServiceResponse} from "../../models/DTOs/api_service_response";
@Injectable({
  providedIn: 'root'
})
export class UserService {
  RegisterURL:string='http://localhost:52859/lego_project_api/Users';
  LoginURL:string='http://localhost:52859/lego_project_api/Users/Login';
  private authState = new BehaviorSubject<boolean>(false)
  constructor(private client: HttpClient) { }
  public register(user:RegRequestUserDto) {
    return this.client.post<ApiServiceResponse>(this.RegisterURL,user);
  }
  public login(user:AuthRequestUserDto){
    return this.client.post<ApiServiceResponse>(this.LoginURL,user);
  }
  public logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    this.sendAuthStateChangeNotification(false);
  }
  public sendAuthStateChangeNotification = (isAuthenticated: boolean) => {
    this.authState.next(isAuthenticated);
  }
  getAuthStateChangeNotification(): Observable<any>{
    return this.authState.asObservable();
  }
}
