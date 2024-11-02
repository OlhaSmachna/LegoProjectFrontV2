import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {ListDto} from "../models/DTOs/List/list.dto";
@Injectable({
  providedIn: 'root'
})
export class ListsEventsService {
  private selectedList = new Subject<ListDto>();
  private createdList = new Subject<ListDto>();
  private updatedList = new Subject<ListDto>();
  private deletedList = new Subject<number>();
  sendSelectListEvent(selectedList:ListDto) {
    this.selectedList.next(selectedList);
  }
  getSelectListEvent(): Observable<ListDto>{
    return this.selectedList.asObservable();
  }
  sendListCreatedEvent(createdList:ListDto) {
    this.createdList.next(createdList);
  }
  getListCreatedEvent(): Observable<ListDto>{
    return this.createdList.asObservable();
  }
  sendListUpdatedEvent(updatedList:ListDto) {
    this.updatedList.next(updatedList);
  }
  getListUpdatedEvent(): Observable<ListDto>{
    return this.updatedList.asObservable();
  }
  sendListDeletedEvent(deletedListID:number) {
    this.deletedList.next(deletedListID);
  }
  getListDeletedEvent(): Observable<number>{
    return this.deletedList.asObservable();
  }
}
