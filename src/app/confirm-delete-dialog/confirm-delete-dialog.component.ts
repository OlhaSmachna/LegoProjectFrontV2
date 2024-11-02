import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { HttpErrorResponse } from "@angular/common/http";
import {CategoryService} from "../shared/services/api/category-service";
import {ListService} from "../shared/services/api/list-service";
import {CategoriesEventsService} from "../shared/services/events/categories-events-service";
import {ListsEventsService} from "../shared/services/events/lists-events-service";
import {ResponseHandler} from "../shared/services/tools/response-handler";
import {BricksService} from "../shared/services/api/brick-service";
import {BricksEventsService} from "../shared/services/events/bricks-events-service";
import {MenuEventsService} from "../shared/services/events/menu-events-service";
import {MenuOptions} from "../menu/menu.component";
import {Subscription} from "rxjs";

export enum DeleteOptions{
  CATEGORY= 'category',
  LIST = 'list',
  BRICK = 'brick'
}
export interface DeleteDialogData {
  deleteOption: DeleteOptions;
  id: any;
  name: string;
}
@Component({
  selector: 'app-confirm-delete-dialog',
  templateUrl: './confirm-delete-dialog.component.html'
})
export class ConfirmDeleteDialogComponent implements OnInit, OnDestroy{
  private listTabOpened: boolean = false;
  private tabChangedEventSub: Subscription = new Subscription();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DeleteDialogData,
    public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>,
    private categoryService: CategoryService,
    private listService: ListService,
    private bricksService: BricksService,
    private categoriesEventsService: CategoriesEventsService,
    private listsEventsService: ListsEventsService,
    private bricksEventsService: BricksEventsService,
    private menuEventsService: MenuEventsService,
    private responseHandler: ResponseHandler
  ) {}

  ngOnInit(): void {
    this.tabChangedEventSub = this.menuEventsService.getTabChangedEvent().subscribe(tab => {
      this.listTabOpened = tab == MenuOptions.Lists;
    });
  }

  public delete(): void {
    switch (this.data.deleteOption){
      case DeleteOptions.CATEGORY: {
        this.categoryService.deleteCategory(this.data.id)
          .subscribe({
            next: (response) => {
              if(response.isSuccessful) {
                this.categoriesEventsService.sendCategoryDeletedEvent(this.data.id);
                this.responseHandler.serverResponse(response);
                this.dialogRef.close();
              }
              else this.responseHandler.errorFromServerResponse(response);
            },
            error: (err: HttpErrorResponse) => {
              this.responseHandler.serverNotRespondingError(err);
            }})
      }
      break;
      case DeleteOptions.LIST: {
        this.listService.deleteList(this.data.id)
          .subscribe({
            next: (response) => {
              if(response.isSuccessful) {
                this.listsEventsService.sendListDeletedEvent(this.data.id);
                this.responseHandler.serverResponse(response);
                this.dialogRef.close();
              }
              else this.responseHandler.errorFromServerResponse(response);
            },
            error: (err: HttpErrorResponse) => {
              this.responseHandler.serverNotRespondingError(err);
            }})
      }
      break;
      case DeleteOptions.BRICK: {
        this.bricksService.deleteBrick(this.data.id)
          .subscribe({
            next: (response) => {
              if(response.isSuccessful) {
                this.responseHandler.serverResponse(response);
                this.bricksEventsService.sendBrickDeletedEvent(this.data.id);
                if(this.listTabOpened) this.listsEventsService.sendChangesInListEvent();
                this.dialogRef.close();
              }
              else this.responseHandler.errorFromServerResponse(response);
            },
            error: (err: HttpErrorResponse) => {
              this.responseHandler.serverNotRespondingError(err);
            }})
      }
      break;
    }
  }

  ngOnDestroy(): void {
    this.tabChangedEventSub.unsubscribe();
  }
}
