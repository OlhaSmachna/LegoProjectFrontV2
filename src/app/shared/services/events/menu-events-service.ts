import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {CategoryDto} from "../models/DTOs/Category/category.dto";
import {MenuOptions} from "../../menu/menu.component";
@Injectable({
  providedIn: 'root'
})
export class MenuEventsService {
  private subject = new Subject<MenuOptions>();
  sendTabChangedEvent(option:MenuOptions) {
    this.subject.next(option);
  }
  getTabChangedEvent(): Observable<MenuOptions>{
    return this.subject.asObservable();
  }
}
