import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {ListDto} from "../../DTOs/List/list.dto";
import {BrickListDto} from "../../DTOs/Brick/brick-list.dto";
@Injectable({
  providedIn: 'root'
})
export class ListsEventsService {
  private selectedList: BehaviorSubject<ListDto> = new BehaviorSubject<ListDto>({id: -1, name: '', uniqueCount: 0});
  private createdList: Subject<ListDto> = new Subject<ListDto>();
  private updatedList: Subject<ListDto> = new Subject<ListDto>();
  private deletedListId: Subject<number> = new Subject<number>();
  private changed: Subject<boolean> = new Subject<boolean>();
  private added: Subject<boolean> = new Subject<boolean>();
  public sendSelectListEvent(selectedList: ListDto) {
    this.selectedList.next(selectedList);
  }
  public unselect(): void{
    this.selectedList.next({id: -1, name: '', uniqueCount: 0});
  }
  public getSelectListEvent(): Observable<ListDto>{
    return this.selectedList.asObservable();
  }
  public sendListCreatedEvent(createdList:ListDto) {
    this.createdList.next(createdList);
  }
  public getListCreatedEvent(): Observable<ListDto>{
    return this.createdList.asObservable();
  }
  public sendListUpdatedEvent(updatedList:ListDto) {
    this.updatedList.next(updatedList);
  }
  public getListUpdatedEvent(): Observable<ListDto>{
    return this.updatedList.asObservable();
  }
  public sendListDeletedEvent(deletedListID:number) {
    this.deletedListId.next(deletedListID);
  }
  public getListDeletedEvent(): Observable<number>{
    return this.deletedListId.asObservable();
  }

  public sendChangesInListEvent() {
    this.changed.next(true);
  }
  public getChangesInListEvent(): Observable<boolean>{
    return this.changed.asObservable();
  }
  public sendAddedToListListEvent() {
    this.added.next(true);
  }
  public getAddedToListListEvent(): Observable<boolean>{
    return this.added.asObservable();
  }
}
