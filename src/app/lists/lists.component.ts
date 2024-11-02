import {Component, OnDestroy, OnInit} from '@angular/core';
import {ListService} from "../shared/services/api/list-service";
import {ListsEventsService} from "../shared/services/events/lists-events-service";
import {CategoriesEventsService} from "../shared/services/events/categories-events-service";
import {UserEventsService} from "../shared/services/events/user-events-service";
import {Subscription} from "rxjs";
import {ResponseHandler} from "../shared/services/tools/response-handler";
import { HttpErrorResponse } from "@angular/common/http";
import {ListDto} from "../shared/DTOs/List/list.dto";

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit, OnDestroy{
  public lists: ListDto[] = [];
  public selectedList: ListDto = {id: 0, name: '', uniqueCount: 0};
  public isUserAuthenticated: boolean = false;
  private listCreatedEventSub: Subscription = new Subscription();
  private listUpdatedEventSub: Subscription = new Subscription();
  private listDeletedEventSub: Subscription = new Subscription();
  private listSelectedEventSub: Subscription = new Subscription();
  private authChangedEventSub: Subscription = new Subscription();
  private changesInListEventSub: Subscription = new Subscription();
  public isLoading: boolean = false;

  constructor(
    private listService: ListService,
    private listsEventsService: ListsEventsService,
    private categoriesEventsService: CategoriesEventsService,
    public httpResponseHandler: ResponseHandler,
    private userEventsService: UserEventsService
  ) {}

  ngOnInit(): void {
    this.listSelectedEventSub = this.listsEventsService.getSelectListEvent().subscribe(list => {
      this.selectedList = list;
    });
    this.listCreatedEventSub = this.listsEventsService.getListCreatedEvent().subscribe(list => {
      if (list.id != 0) this.lists.push(list);
      this.sortLists();
    });
    this.listUpdatedEventSub = this.listsEventsService.getListUpdatedEvent().subscribe(list => {
      if (list.id != 0) {
        let index = this.lists.findIndex(l => l.id == list.id);
        if(index != -1)this.lists[index].name = list.name;
      }
      this.sortLists();
    });
    this.listDeletedEventSub = this.listsEventsService.getListDeletedEvent().subscribe(id => {
      if (id != 0) this.lists = this.lists.filter(list => list.id != id);
      this.sortLists();
    });
    this.authChangedEventSub = this.userEventsService.getAuthStateChangeNotification().subscribe(state => {
      this.isUserAuthenticated = state;
    });
    this.changesInListEventSub = this.listsEventsService.getChangesInListEvent().subscribe(change => {
      this.isLoading = true;
      this.getLists();
    });

    if(this.isUserAuthenticated) {
      this.isLoading = true;
      this.getLists();
    }
  }

  private getLists(): void {
    this.listService.getLists().subscribe({
        next: (response) => {
          if(response.isSuccessful) {
            this.lists = response.result as ListDto[];
            this.sortLists();
            this.isLoading = false;
          }
          else this.httpResponseHandler.errorFromServerResponse(response);
        },
        error: (err: HttpErrorResponse) => {
          this.httpResponseHandler.serverNotRespondingError(err);
        }})
  }

  public selectList(selectedList: ListDto): void {
    this.selectedList = selectedList;
    this.listsEventsService.sendSelectListEvent(this.selectedList);
    this.categoriesEventsService.unselect();
  }

  private sortLists(): void {
    this.lists = this.lists.sort((l1,l2) => l1.name.localeCompare(l2.name));
  }

  ngOnDestroy(): void {
    this.listCreatedEventSub.unsubscribe();
    this.listUpdatedEventSub.unsubscribe();
    this.listDeletedEventSub.unsubscribe();
    this.listSelectedEventSub.unsubscribe();
    this.authChangedEventSub.unsubscribe();
    this.changesInListEventSub.unsubscribe();
  }
}
