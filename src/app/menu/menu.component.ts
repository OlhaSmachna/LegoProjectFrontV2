import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {SidenavService} from "../shared/services/tools/sidenav-service";
import {BricksService} from "../shared/services/api/brick-service";
import {UserEventsService} from "../shared/services/events/user-events-service";
import {MenuEventsService} from "../shared/services/events/menu-events-service";
import {CategoriesEventsService} from "../shared/services/events/categories-events-service";
import {ListsEventsService} from "../shared/services/events/lists-events-service";
import { HttpErrorResponse } from "@angular/common/http";
import {ResponseHandler} from "../shared/services/tools/response-handler";
import {BtnImagesUrls} from "../shared/data/btn-images-urls";
import {UserRoles} from "../shared/DTOs/Role/role.dto";

import {ListDialogComponent} from "../list-dialog/list-dialog.component";
import {BrickDialogComponent} from "../brick-dialog/brick-dialog.component";
import {UploadDialogComponent} from "../upload-dialog/upload-dialog.component";
import {CategoryDialogComponent} from "../category-dialog/category-dialog.component";
import {ConfirmDeleteDialogComponent, DeleteOptions} from "../confirm-delete-dialog/confirm-delete-dialog.component";

import {CategoryDto} from "../shared/DTOs/Category/category.dto";
import {ListDto} from "../shared/DTOs/List/list.dto";
import {BrickDto} from "../shared/DTOs/Brick/brick.dto";
import {BrickExtendedDto} from "../shared/DTOs/Brick/brick-extended.dto";
import {DevDialogComponent} from "../dev-dialog/dev-dialog.component";
import {DevDialogEventsService} from "../shared/services/events/dev-dialog-events-service";

export enum MenuOptions {
  Categories,
  Filters,
  Lists
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {
  //=== USER INFO ===
  public isUserAuthenticated: boolean = false;
  public isUserAdmin: boolean = false;
  public isUserDev: boolean = false;

  //=== MENU INFO ===
  public isDevDialogOpened: boolean = false;
  public isMenuOpened: boolean = true;
  public activeTab: MenuOptions = MenuOptions.Categories;

  public get MenuOptions(): typeof MenuOptions {
    return MenuOptions;
  }
  public selectedCategory: CategoryDto;
  private emptyCat: CategoryDto = {id: 0, name: ''}
  public selectedList: ListDto;
  private emptyList: ListDto = {id: 0, name: '', uniqueCount: 0}
  private emptyBrick: BrickExtendedDto;

  //=== SUBSCRIPTIONS ===
  private authChangedEventSub: Subscription = new Subscription();
  private roleChangedEventSub: Subscription = new Subscription();
  private selectCategoryEventSub: Subscription = new Subscription();
  private selectListEventSub: Subscription = new Subscription();
  private devDialogEventSub: Subscription = new Subscription();


  constructor(
    private bricksService: BricksService,
    private userEventsService: UserEventsService,
    private categoriesEventsService: CategoriesEventsService,
    private listsEventsService: ListsEventsService,
    private menuEventsService: MenuEventsService,
    private devDialogEventsService: DevDialogEventsService,
    private sidenav: SidenavService,
    private router: Router,
    public btnUrls: BtnImagesUrls,
    public matDialog: MatDialog,
    public devDialog: MatDialog,
    public responseHandler: ResponseHandler
  ) {
    this.selectedCategory = this.emptyCat;
    this.selectedList = this.emptyList;
  }

  ngOnInit(): void {
    this.devDialogEventSub = this.devDialogEventsService.getToggleEvent().subscribe(state => {
      this.isDevDialogOpened = state;
    });
    this.selectCategoryEventSub = this.categoriesEventsService.getSelectCategoryEvent().subscribe(cat => {
      if (cat.id != 0) {
        this.selectedCategory = cat;
      } else this.selectedCategory = this.emptyCat;
    });
    this.selectListEventSub = this.listsEventsService.getSelectListEvent().subscribe(list => {
      if (list.id != 0) {
        this.selectedList = list;
      } else this.selectedList = this.emptyList;
    });
    this.authChangedEventSub = this.userEventsService.getAuthStateChangeNotification().subscribe(state => {
      this.isUserAuthenticated = state;
      if(this.activeTab == MenuOptions.Lists) this.activeTab = MenuOptions.Categories;
    });
    this.roleChangedEventSub = this.userEventsService.getRoleChangeNotification().subscribe(role => {
      this.isUserAdmin = role == UserRoles.ADMIN || role == UserRoles.DEVELOPER;
      this.isUserDev = role == UserRoles.DEVELOPER;
    });
  }

  public addBrickMenuClick(): void {
    this.emptyBrick = {
      id: '',
      name: '',
      materialID: 0,
      categoryID: 0,
      hasImage: false,
      imageVersion: 0,
      colorIDs: []
    }
    this.matDialog.open(BrickDialogComponent, {
      data: {
        brick: this.emptyBrick,
        isNew: true
      }
    });
  }

  public createMenuClick(): void {
    switch (this.activeTab){
      case MenuOptions.Categories:{
        this.emptyCat  = {id: 0, name: ''}
        this.matDialog.open(CategoryDialogComponent, {
          data: {
            category: this.emptyCat,
            isNew: true
          }
        });
      }
      break;
      case MenuOptions.Lists:{
        this.emptyList = {id: 0, name: '', uniqueCount: 0}
        this.matDialog.open(ListDialogComponent, {
          data: {
            list: this.emptyList,
            isNew: true
          }
        });
      }
      break;
    }
  }

  public editMenuClick(): void{
    switch (this.activeTab){
      case MenuOptions.Categories:{
        this.matDialog.open(CategoryDialogComponent, {
          data: {
            category: this.selectedCategory,
            isNew: false
          }
        });
      }
      break;
      case MenuOptions.Lists:{
        this.matDialog.open(ListDialogComponent, {
          data: {
            list: this.selectedList,
            isNew: false
          }
        });
      }
      break;
    }
  }

  public deleteMenuClick(): void{
    switch (this.activeTab){
      case MenuOptions.Categories: {
        this.matDialog.open(ConfirmDeleteDialogComponent, {
          data: {
            deleteOption: DeleteOptions.CATEGORY,
            id: this.selectedCategory.id,
            name: this.selectedCategory.name
          }
        });
      }
      break;
      case MenuOptions.Lists: {
        this.matDialog.open(ConfirmDeleteDialogComponent, {
          data: {
            deleteOption: DeleteOptions.LIST,
            id: this.selectedList.id,
            name: this.selectedList.name
          }
        });
      }
      break;
    }
  }

  public exportListMenuClick(): void{
    if(this.selectedList.id > 0){
      this.bricksService.getBricksByList(this.selectedList.id)
        .subscribe({
          next: (response) => {
            if(response.isSuccessful){
              let loadedBricks: BrickDto[] = response.result as BrickDto[];
              if(loadedBricks.length != 0) {
                let xml: string = '<INVENTORY>';
                loadedBricks.forEach(brick => {
                  let color: number = brick.colors.length > 0 ? brick.colors[0].id : 9999;
                  xml += '<ITEM><ITEMTYPE>P</ITEMTYPE><ITEMID>' + brick.id + '</ITEMID><COLOR>'
                    + color + '</COLOR><QTY>1</QTY></ITEM>';
                })
                xml += '</INVENTORY>';
                let file = new Blob([xml], {type: '.xml'});
                let a = document.createElement("a"), url = URL.createObjectURL(file);
                a.href = url;
                a.download = 'inventory.xml';
                document.body.appendChild(a);
                a.click();
                setTimeout(function() {
                  document.body.removeChild(a);
                  window.URL.revokeObjectURL(url);
                }, 0);
              }
              else {
                this.responseHandler.errorLocal('List is empty.');
              }
            }
            else{
              this.responseHandler.errorFromServerResponse(response);
            }
          },
          error: (err: HttpErrorResponse) => {
            this.responseHandler.serverNotRespondingError(err);
          }})
    }
  }
  public importListMenuClick(): void {
    this.matDialog.open(UploadDialogComponent);
  }

  public logoutMenuClick():void{
    this.activeTab = MenuOptions.Categories;
    this.menuEventsService.sendTabChangedEvent(this.activeTab);
    this.userEventsService.sendLogoutNotification();
  }
  public goToLoginMenuClick():void{
    this.router.navigate(["bricks_manager/login"]);
  }
  public goToAboutMenuClick():void{
    this.router.navigate(["bricks_manager/about"]);
  }

  public tabBtnMenuClick(option: MenuOptions){
    if(this.isMenuOpened && this.activeTab == option){
      this.isMenuOpened = false;
      this.sidenav.close();
    }
    else {
      this.isMenuOpened = true;
      this.activeTab = option;
      this.menuEventsService.sendTabChangedEvent(this.activeTab);
      this.sidenav.open();
    }
    this.menuEventsService.sendMenuToggleEvent(this.isMenuOpened);
  }

  public openDevTabMenuClick() {
    if(!this.isDevDialogOpened) {
      this.devDialog.open(DevDialogComponent, {
        width: '50%',
        hasBackdrop: false,
        panelClass: 'dev-dialog'
      });
    }
    else {
      this.devDialog.closeAll();
    }
    this.isDevDialogOpened = !this.isDevDialogOpened;
  }

  ngOnDestroy(): void {
    this.authChangedEventSub.unsubscribe();
    this.roleChangedEventSub.unsubscribe();
    this.selectCategoryEventSub.unsubscribe();
    this.selectListEventSub.unsubscribe();
  }
}
