import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {ListService} from "../shared/services/api/list-service";
import {ValidationService} from "../shared/services/tools/validation-service";
import {ResponseHandler} from "../shared/services/tools/response-handler";
import {BrickListDto} from "../shared/DTOs/Brick/brick-list.dto";
import { HttpErrorResponse } from "@angular/common/http";
import {Subscription} from "rxjs";
import {ListsEventsService} from "../shared/services/events/lists-events-service";
import {MenuOptions} from "../menu/menu.component";
import {MenuEventsService} from "../shared/services/events/menu-events-service";

export interface Item{
  ITEMTYPE: string,
  ITEMID: string,
  COLOR: string,
  QTY: string
}

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.scss']
})
export class UploadDialogComponent implements OnInit, OnDestroy{
  public xmlString: string = '';
  public fileName: string = '';
  public selectedListId: number;
  private listTabOpened: boolean = false;
  private selectListEventSub: Subscription = new Subscription();
  private tabChangedEventSub: Subscription = new Subscription();

  constructor(
    private dialogRef: MatDialogRef<UploadDialogComponent>,
    private listService: ListService,
    private listsEventsService: ListsEventsService,
    private menuEventsService: MenuEventsService,
    private validationService: ValidationService,
    private responseHandler: ResponseHandler

    ) {
    (window as any).global = window;
  }

  ngOnInit(): void {
    this.tabChangedEventSub = this.menuEventsService.getTabChangedEvent().subscribe(tab => {
      this.listTabOpened = tab == MenuOptions.Lists;
    });
    this.selectListEventSub = this.listsEventsService.getSelectListEvent().subscribe(list => {
      this.selectedListId = list.id
    });
  }
  public onFileInput($event: Event): void {
    const uploadedFile: File | undefined = ($event.target as HTMLInputElement)?.files?.[0];
    if (uploadedFile) {
      this.fileName = uploadedFile.name;
      const reader = new FileReader();
      reader.onload = () => this.xmlString = reader.result ? reader.result.toString() : '';
      reader.readAsText(uploadedFile);
    }
  }

  public uploadClick(): void {
    const txml = require('txml');
    let jsonInventory = txml.simplify(txml.parse(this.xmlString));
    let toListDtoArr: BrickListDto[] = [];
    //XML string parsing:
    try {
      if(jsonInventory.INVENTORY.ITEM.length) {
        jsonInventory.INVENTORY.ITEM.forEach((item: Item) => {
          if(item.ITEMTYPE && item.ITEMID && item.COLOR && item.QTY) {
            toListDtoArr.push({
              brickId: item.ITEMID,
              colorId: Number(item.COLOR),
              quantity: 1
            })
          }
          else throw new Error();
        })
      }
      else if(jsonInventory.INVENTORY.ITEM.ITEMTYPE && jsonInventory.INVENTORY.ITEM.ITEMID
      && jsonInventory.INVENTORY.ITEM.COLOR && jsonInventory.INVENTORY.ITEM.QTY) {
        toListDtoArr.push({
          brickId: jsonInventory.INVENTORY.ITEM.ITEMID,
          colorId: Number(jsonInventory.INVENTORY.ITEM.COLOR),
          quantity: 1
        })
      }
      else throw new Error();
    }
    catch (error) {
      this.responseHandler.errorLocal('XML string format invalid.');
    }

    this.listService.addBricks(this.selectedListId, toListDtoArr).subscribe({
      next: (response) => {
        if(response.isSuccessful){
          this.responseHandler.serverResponse(response);
          if(this.listTabOpened) this.listsEventsService.sendChangesInListEvent();
          if(this.listTabOpened && this.selectedListId != -1)
            this.listsEventsService.sendAddedToListListEvent();
          this.dialogRef.close();
        }
        else this.responseHandler.errorFromServerResponse(response);
      },
      error: (err: HttpErrorResponse) => {
        this.dialogRef.close();
        this.responseHandler.serverNotRespondingError(err);
      }});
  }

  ngOnDestroy(): void {
    this.selectListEventSub.unsubscribe();
  }
}
