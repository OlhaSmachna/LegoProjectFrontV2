import {Injectable} from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  public notEmptyOrSpaces(str:string):boolean{
    return !(str === null || str.match(/^ *$/) !== null) && !str.includes('/');
  }
  public matchesEmailTemplate(str:string):boolean{
    return (str.match("[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}") !== null);
  }
}
