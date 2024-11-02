import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {RoleDto, UserRoles} from "../../models/DTOs/Role/role.dto";

@Injectable({
  providedIn: 'root'
})
export class UserEventsService {
  private authState = new BehaviorSubject<boolean>(false);
  private role = new BehaviorSubject<UserRoles>(UserRoles.USER);
  public logout(): void{
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    this.sendAuthStateChangeNotification(false);
  }
  public sendAuthStateChangeNotification = (isAuthenticated: boolean) => {
    this.authState.next(isAuthenticated);
  }
  getAuthStateChangeNotification(): Observable<boolean>{
    return this.authState.asObservable();
  }

  public sendRoleChangeNotification = (role: RoleDto) => {
    this.role.next(role.name as UserRoles);
  }
  getRoleChangeNotification(): Observable<UserRoles>{
    return this.role.asObservable();
  }
}
