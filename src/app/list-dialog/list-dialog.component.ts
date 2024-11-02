import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ListService} from "../shared/services/api/list-service";
import {ListsEventsService} from "../shared/services/events/lists-events-service";
import {ResponseHandler} from "../shared/services/tools/response-handler";
import { HttpErrorResponse } from "@angular/common/http";
import {ValidationService} from "../shared/services/tools/validation-service";
import {ListDto} from "../shared/DTOs/List/list.dto";
export interface ListDialogData {
  list: ListDto;
  isNew: boolean;
}
@Component({
  selector: 'app-list-dialog',
  templateUrl: './list-dialog.component.html',
  styleUrls: ['./list-dialog.component.scss']
})
export class ListDialogComponent {
  public listName: string = 'New List';
  public listNameValid: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ListDialogData,
    private dialogRef: MatDialogRef<ListDialogComponent>,
    private listService: ListService,
    private listsEventsService: ListsEventsService,
    private validationService: ValidationService,
    private responseHandler: ResponseHandler
    ) {
    if(this.data.list.name != '') this.listName = this.data.list.name;
  }

  public saveList(): void {
    this.listNameValid = this.validationService.notEmptyOrSpaces(this.listName);
    if(this.listNameValid) {
      this.data.list.name = this.listName;
      if(this.data.isNew) {
        this.listService.createList(this.data.list)
          .subscribe({
            next: (response) => {
              if(response.isSuccessful) {
                this.listsEventsService.sendListCreatedEvent(response.result);
                this.responseHandler.serverResponse(response);
                this.dialogRef.close();
              }
              else this.responseHandler.errorFromServerResponse(response);
            },
            error: (err: HttpErrorResponse) => {
              this.responseHandler.serverNotRespondingError(err);
            }})
      }
      else {
        this.listService.editList(this.data.list)
          .subscribe({
            next: (response) => {
              if(response.isSuccessful) {
                this.listsEventsService.sendListUpdatedEvent(response.result);
                this.responseHandler.serverResponse(response);
                this.dialogRef.close();
              }
              else {
                this.responseHandler.errorFromServerResponse(response);
                if(!response.errorMessage) this.dialogRef.close();
              }
            },
            error: (err: HttpErrorResponse) => {
              this.responseHandler.serverNotRespondingError(err);
            }})
      }
    }
  }
}
