import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RouterEventsService {
  private routeParam: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public setRouteParam = (routeParam: boolean) => {
    this.routeParam.next(routeParam);
  }
  public getRouteParam(): Observable<boolean>{
    return this.routeParam.asObservable();
  }
}
