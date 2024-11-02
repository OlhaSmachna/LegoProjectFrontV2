import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {MenuOptions} from "../../../menu/menu.component";

@Injectable({
  providedIn: 'root'
})
export class MenuEventsService {
  private tab: BehaviorSubject<MenuOptions> = new BehaviorSubject<MenuOptions>(MenuOptions.Categories);
  private isOpened: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public sendTabChangedEvent(option: MenuOptions) {
    this.tab.next(option);
  }
  public getTabChangedEvent(): Observable<MenuOptions>{
    return this.tab.asObservable();
  }
  public sendMenuToggleEvent(state: boolean) {
    this.isOpened.next(state);
  }
  public getMenuToggleEvent(): Observable<boolean>{
    return this.isOpened.asObservable();
  }
}
