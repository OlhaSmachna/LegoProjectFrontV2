import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {UserRoles} from "../../DTOs/Role/role.dto";
import {LoginResponseUserDto} from "../../DTOs/User/login-response-user.dto";

@Injectable({
  providedIn: 'root'
})
export class UserEventsService {
  private authState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private role: BehaviorSubject<UserRoles> = new BehaviorSubject<UserRoles>(UserRoles.USER);

  public sendLogoutNotification(): void{
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    this.authState.next(false);
  }

  public sendSuccessfulLoginNotification(loginResponse: LoginResponseUserDto){
    localStorage.setItem("user", loginResponse.email);
    localStorage.setItem("token", loginResponse.token);
    localStorage.setItem("refreshToken", loginResponse.refreshToken);
    this.authState.next(true);
    this.role.next(loginResponse.role.name as UserRoles);
  }

  public getAuthStateChangeNotification(): Observable<boolean>{
    return this.authState.asObservable();
  }

  public getRoleChangeNotification(): Observable<UserRoles>{
    return this.role.asObservable();
  }
}
