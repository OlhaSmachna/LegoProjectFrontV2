import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {MenuOptions} from "../../../menu/menu.component";

@Injectable({
  providedIn: 'root'
})
export class DevDialogEventsService {
  private isOpened: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public sendToggleEvent(state: boolean) {
    this.isOpened.next(state);
  }
  public getToggleEvent(): Observable<boolean>{
    return this.isOpened.asObservable();
  }
}
