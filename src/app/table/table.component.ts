import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Subscription} from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

import {MatTableDataSource} from "@angular/material/table";
import {Sort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";

import {ConfirmDeleteDialogComponent, DeleteOptions} from "../confirm-delete-dialog/confirm-delete-dialog.component";
import {BrickDialogComponent} from "../brick-dialog/brick-dialog.component";

import {BricksService} from "../shared/services/api/brick-service";
import {ListService} from "../shared/services/api/list-service";

import {CategoriesEventsService} from "../shared/services/events/categories-events-service";
import {UserEventsService} from "../shared/services/events/user-events-service";
import {FiltersEventsService} from "../shared/services/events/filters-events-service";
import {ListsEventsService} from "../shared/services/events/lists-events-service";

import {ValidationService} from "../shared/services/tools/validation-service";
import {CloudService} from "../shared/services/tools/cloud-service";
import {ResponseHandler} from "../shared/services/tools/response-handler";

import {BrickDto} from "../shared/DTOs/Brick/brick.dto";
import {ListDto} from "../shared/DTOs/List/list.dto";
import {BrickExtendedDto} from "../shared/DTOs/Brick/brick-extended.dto";
import {ColorDto} from "../shared/DTOs/Color/color.dto";
import {BrickListDto} from "../shared/DTOs/Brick/brick-list.dto";
import {BtnImagesUrls} from "../shared/data/btn-images-urls";
import {UserRoles} from "../shared/DTOs/Role/role.dto";
import {BrickListDeleteDto} from "../shared/DTOs/Brick/brick-list-delete.dto";
import {MenuEventsService} from "../shared/services/events/menu-events-service";
import {MenuOptions} from "../menu/menu.component";
import {BricksEventsService} from "../shared/services/events/bricks-events-service";
import {ColorService} from "../shared/services/api/color-service";
import {CloudinaryImage} from "@cloudinary/url-gen";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  //Expanded row animation
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', borderBottomWidth: '0'})),
      state('expanded', style({height: '*',  borderBottomWidth: '1px'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TableComponent implements OnInit, OnDestroy{
  //=== MAT-TABLE ===
  displayedColumns: string[] = ['image', 'id', 'name', 'material', 'colors', 'quantity', 'actions'];
  dataSource: MatTableDataSource<BrickDto> = new MatTableDataSource();
  public isLoading: boolean = false;
  public expandedElement: BrickDto | null;
  public displayedByList: boolean = false;

  //=== TO LIST FUNC DATA ===
  public selectedColor: number = 9999;
  public selectedListId: number = -1;
  public selectedQuantity: number = 1;
  public quantityInList: number = 1;

  //=== SUBSCRIPTIONS ===
  private selectCategoryEventSub: Subscription = new Subscription();
  private selectListEventSub: Subscription = new Subscription();
  private listCreatedEventSub: Subscription = new Subscription();
  private listUpdatedEventSub: Subscription = new Subscription();
  private listDeletedEventSub: Subscription = new Subscription();
  private addedToListEventSub: Subscription = new Subscription();
  private brickUpdatedEventSub: Subscription = new Subscription();
  private brickDeletedEventSub: Subscription = new Subscription();
  private authChangedEventSub: Subscription = new Subscription();
  private roleChangedEventSub: Subscription = new Subscription();
  private tabChangedEventSub: Subscription = new Subscription();
  private filtersAppliedEventSub: Subscription = new Subscription();
  private filtersOffEventSub: Subscription = new Subscription();

  //=== USER DATA ===
  public isUserAuthenticated: boolean = false;
  public isUserAdmin: boolean = false;
  public userLists: ListDto[];

  //=== PAGINATION ===
  public loadedBricks: BrickDto[] = [];
  public bricksToDisplay: BrickDto[] = [];
  public bricksFilteredUnsorted: BrickDto[] = [];
  public bricksToDisplayCount: number = 0;
  public displayStartIndex: number = 0;
  public displayCount: number = 500;

  //=== OTHER ===
  public searchString: string = '';
  public startAnnouncement: string = 'Select Category to start working...';
  public emptyAnnouncement: string = 'Nothing found...';
  public tableAnnouncement: string = this.startAnnouncement;
  private listTabOpened: boolean = false;
  public tabContentHeight: number = 180;
  public tabIndex: number = 0;
  public availableColors: ColorDto[];
  public renderStart: number;


  constructor(
    private bricksService: BricksService,
    private listService: ListService,
    private colorService: ColorService,
    private userEventsService: UserEventsService,
    private categoriesEventsService: CategoriesEventsService,
    private listsEventsService: ListsEventsService,
    private bricksEventsService: BricksEventsService,
    private filtersEventsService: FiltersEventsService,
    private menuEventsService: MenuEventsService,
    private validationService: ValidationService,
    private responseHandler: ResponseHandler,
    private matDialog: MatDialog,
    public btnUrls: BtnImagesUrls,
    public cloudService: CloudService
    ) {}

  ngOnInit(): void {
    this.tabChangedEventSub = this.menuEventsService.getTabChangedEvent().subscribe(tab => {
      this.listTabOpened = tab == MenuOptions.Lists;
    });

    this.selectCategoryEventSub = this.categoriesEventsService.getSelectCategoryEvent().subscribe(cat => {
      if(cat.id != -1) this.getBricksAllOrByCategory(cat.id);
    });
    this.selectListEventSub = this.listsEventsService.getSelectListEvent().subscribe(list => {
      this.selectedListId = list.id;
      if(list.id != -1) this.getBricksByList(list.id);
    });

    this.listCreatedEventSub = this.listsEventsService.getListCreatedEvent().subscribe(list => {
      if (list.id != 0) this.userLists.push(list);
      this.sortLists();
    });
    this.listUpdatedEventSub = this.listsEventsService.getListUpdatedEvent().subscribe(list => {
      if (list.id != 0) {
        let index = this.userLists.findIndex(l => l.id == list.id);
        if(index != -1)this.userLists[index].name = list.name;
      }
      this.sortLists();
    });
    this.listDeletedEventSub = this.listsEventsService.getListDeletedEvent().subscribe(id => {
      if(id == this.selectedListId){
        this.loadedBricks = [];
        this.bricksToDisplay = [];
        this.fillTable();
        this.tableAnnouncement = this.startAnnouncement;
      }
      this.selectedListId = -1;
      if (id != 0) this.userLists = this.userLists.filter(list => list.id != id);
      this.sortLists();
    });
    this.addedToListEventSub = this.listsEventsService.getAddedToListListEvent().subscribe(id => {
      this.getBricksByList(this.selectedListId);
    });

    this.brickUpdatedEventSub = this.bricksEventsService.getBrickUpdatedEvent().subscribe(brick => {
      if (brick.id != null) {
        let image: CloudinaryImage;
        if(brick.imageVersion != 0){
          image = this.cloudService.getImageWithVersion(brick.id, brick.imageVersion, 70);
        }
        else {
          image = this.cloudService.getImage(brick.id, 70);
        }

        let indexLoaded = this.loadedBricks.findIndex(b => b.id == brick.id);
        if(indexLoaded != -1) {
          this.loadedBricks[indexLoaded] = brick;
          this.loadedBricks[indexLoaded].img = image;
        }

        let indexDisplayed = this.bricksToDisplay.findIndex(b => b.id == brick.id);
        if(indexDisplayed != -1) {
          this.bricksToDisplay[indexDisplayed] = brick;
          this.bricksToDisplay[indexDisplayed].img = image;
        }

        this.setDataSrc();
      }
    });
    this.brickDeletedEventSub = this.bricksEventsService.getBrickDeletedEvent().subscribe(id => {
      if(id != null) {
        this.loadedBricks = this.loadedBricks.filter(brick => brick.id != id);
        this.bricksToDisplay = this.bricksToDisplay.filter(brick => brick.id != id);
        this.bricksToDisplayCount = this.bricksToDisplay.length;
        this.setDataSrc();
      }
    });

    this.authChangedEventSub = this.userEventsService.getAuthStateChangeNotification().subscribe(state => {
      if(this.isUserAuthenticated != state) {
        this.isUserAuthenticated = state;
        this.adjustDisplayedColumns();
        if(this.isUserAuthenticated) this.loadLists();
      }
      if(!state && this.displayedByList) {
        this.loadedBricks = [];
        this.bricksToDisplay = [];
        this.fillTable();
        this.tableAnnouncement = this.startAnnouncement;
      }
    });
    this.roleChangedEventSub = this.userEventsService.getRoleChangeNotification().subscribe(role => {
      this.isUserAdmin = role == UserRoles.ADMIN || role == UserRoles.DEVELOPER;
    });

    this.filtersAppliedEventSub = this.filtersEventsService.getFiltersAppliedEvent().subscribe(filters => {
      let bricksFiltered: BrickDto[] = [];
      let bricksFilteredTemp: BrickDto[] = [];
      filters.selectedMaterials.forEach(selectedMaterial => {
        bricksFiltered.push(...this.loadedBricks.filter(brick => brick.material == selectedMaterial.name));
      })
      if(filters.selectedColors.length !=0){
        if(bricksFiltered.length == 0) bricksFiltered = this.loadedBricks;
        filters.selectedColors.forEach(selectedColor => {
          bricksFilteredTemp.push(...bricksFiltered.filter(brick => brick.colors.findIndex(c => c.id == selectedColor.id) != -1));
        })
        bricksFiltered = bricksFilteredTemp;
        bricksFilteredTemp = [];
      }
      if(filters.selectedIsTransparent){
        if(bricksFiltered.length == 0) bricksFiltered = this.loadedBricks;
        bricksFilteredTemp.push(...bricksFiltered.filter(brick => brick.colors.findIndex(c => c.isTrans) != -1));
        bricksFiltered = bricksFilteredTemp;
      }
      this.bricksToDisplay = bricksFiltered;
      this.bricksFilteredUnsorted = bricksFiltered;
      this.fillTable();
    });
    this.filtersOffEventSub = this.filtersEventsService.getFiltersOffEvent().subscribe(() => {
      this.bricksToDisplay = this.loadedBricks;
      this.bricksFilteredUnsorted = [];
      this.fillTable();
    });

    this.adjustDisplayedColumns();
  }

  //CALL API TO GET BRICKS====================================================
  private getBricksAllOrByCategory(categoryId: number): void {
    this.isLoading = true;
    this.displayedByList = false;
    this.tabContentHeight = 180;
    this.adjustDisplayedColumns();
    this.bricksService.getBricksAllOrByCategory(categoryId)
      .subscribe({
        next: (response) => {
          if(response.isSuccessful) {
            this.loadedBricks = response.result as BrickDto[];
            this.bricksToDisplay = this.loadedBricks;
            this.fillTable();
            this.isLoading = false;
          }
          else {
            this.isLoading = false;
            this.responseHandler.errorFromServerResponse(response);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          this.responseHandler.serverNotRespondingError(err);
        }})
  }
  private getBricksByList(listId: number): void {
    this.isLoading = true;
    this.displayedByList = true;
    this.tabContentHeight = 122;
    this.adjustDisplayedColumns();
    this.bricksService.getBricksByList(listId)
      .subscribe({
        next: (response) => {
          if(response.isSuccessful) {
            this.loadedBricks = response.result as BrickDto[];
            this.bricksToDisplay = this.loadedBricks;
            this.fillTable();
            this.isLoading = false;
          }
          else {
            this.isLoading = false;
            this.responseHandler.errorFromServerResponse(response);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          this.responseHandler.serverNotRespondingError(err);
        }})
  }
  public search(): void{
    if(this.validationService.notEmptyOrSpaces(this.searchString) && this.searchString.length > 2) {
      this.filtersEventsService.sendFiltersOffEvent();
      this.isLoading = true;
      this.displayedByList = false;
      this.tabContentHeight = 180;
      this.adjustDisplayedColumns();
      this.bricksService.searchBricks({pattern: this.searchString})
        .subscribe({
          next: (response) => {
            if(response.isSuccessful) {
              this.loadedBricks = response.result as BrickDto[];
              this.bricksToDisplay = this.loadedBricks;
              this.fillTable();
              this.isLoading = false;
            }
            else {
              this.isLoading = false;
              this.responseHandler.errorFromServerResponse(response);
            }
          },
          error: (err: HttpErrorResponse) => {
            this.isLoading = false;
            this.responseHandler.serverNotRespondingError(err);
          }});
    }
    else {
      this.responseHandler.errorLocal("Search string is to short.");
    }
  }

  //TABLE & DATASOURCE========================================================
  private fillTable(): void{
    this.bricksToDisplayCount = this.bricksToDisplay.length;
    if(this.bricksToDisplayCount != 0){
      this.displayStartIndex = 0;
      this.tableAnnouncement = '';
      this.setDataSrc();
    }
    else {
      this.dataSource = new MatTableDataSource();
      this.tableAnnouncement = this.emptyAnnouncement;
    }
  }
  private setDataSrc(): void{
    let displayedBricks: BrickDto[] = this.bricksToDisplay
      .slice(this.displayStartIndex, this.displayStartIndex + this.displayCount);
    if(this.cloudService.USE_CLOUD){
      displayedBricks.forEach(brick => {
        if (brick.hasImage && !brick.img) {
          if(brick.imageVersion != 0){
            brick.img = this.cloudService.getImageWithVersion(brick.id, brick.imageVersion, 70);
          }
          else {
            brick.img = this.cloudService.getImage(brick.id, 70);
          }
        }
      })
    }
    this.dataSource.data = displayedBricks;
  }
  private adjustDisplayedColumns(): void {
    if(this.displayedColumns.indexOf('actions') != -1)
      this.displayedColumns.splice(this.displayedColumns.indexOf('actions'), 1);
    if(this.displayedColumns.indexOf('quantity') != -1)
      this.displayedColumns.splice(this.displayedColumns.indexOf('quantity'), 1);

    if(this.isUserAuthenticated) {
      if(this.displayedByList) this.displayedColumns.push('quantity');
      this.displayedColumns.push('actions');
    }
  }
  public sortBricks(sort: Sort): void {
    this.displayStartIndex = 0;
    if(this.bricksFilteredUnsorted.length == 0)
      this.bricksToDisplay = [...this.loadedBricks];
    else
      this.bricksToDisplay = [...this.bricksFilteredUnsorted];

    if(sort.direction != "") {
      let direction: number = 0;

      if(sort.direction == "asc") direction = 1;
      else if(sort.direction == "desc") direction = -1;

      switch (sort.active) {
        case "image":
          this.bricksToDisplay.sort((a: BrickDto, b: BrickDto) => {
            return (Number(a.hasImage) - Number(b.hasImage)) * direction;
          });
          break;
        case "id":
          this.bricksToDisplay.sort((a: BrickDto, b: BrickDto) => {
            return (a.id.localeCompare(b.id)) * direction;
          });
          break;
        case "name":
          this.bricksToDisplay.sort((a: BrickDto, b: BrickDto) => {
            return (a.name.localeCompare(b.name)) * direction;
          });
          break;
        case "material":
          this.bricksToDisplay.sort((a: BrickDto, b: BrickDto) => {
            return (a.material.localeCompare(b.material)) * direction;
          });
          break;
        case "colors":
          this.bricksToDisplay.sort((a: BrickDto, b: BrickDto) => {
            return (a.colors.length - b.colors.length) * direction;
          });
          break;
        case "quantity":
          this.bricksToDisplay.sort((a: BrickDto, b: BrickDto) => {
            return (a.quantity - b.quantity) * direction;
          });
          break;
        default:
          break;
      }
    }

    this.setDataSrc();
  }

  //CALL API TO GET LISTS=====================================================
  public loadLists(): void {
    this.listService.getLists()
      .subscribe({
        next: (response) => {
          if(response.isSuccessful) {
            this.userLists = (response.result as ListDto[]);
            this.sortLists();
          }
          else this.responseHandler.errorFromServerResponse(response);
        },
        error: (err: HttpErrorResponse) => {
          this.responseHandler.serverNotRespondingError(err);
        }})
  }
  private sortLists(): void {
    this.userLists = this.userLists.sort((l1,l2) => l1.name.localeCompare(l2.name));
  }

  //PAGINATION & EXPANDED DETAILS=============================================
  public tablePrev(): void{
    if(this.ceil((this.displayStartIndex + 1) / this.displayCount) > 1){
      this.displayStartIndex -= this.displayCount;
      this.setDataSrc();
    }
  }
  public tableNext(): void{
    if(this.ceil((this.displayStartIndex + 1) / this.displayCount) < this
      .ceil(this.bricksToDisplayCount / this.displayCount)) {
      this.displayStartIndex += this.displayCount;
      this.setDataSrc();
    }
  }
  public getMaxDisplayLimit(): number {
    if(this.displayStartIndex + this.displayCount < this.bricksToDisplayCount)
      return this.displayStartIndex + this.displayCount;
    else
      return this.bricksToDisplayCount;
  }
  public ceil(num: number): number{
    return Math.ceil(num);
  }
  public onQuantityChange(): void {
    if(this.selectedQuantity < 1) this.selectedQuantity = 1;
    this.selectedQuantity = Math.floor(this.selectedQuantity);
    if(this.quantityInList < 1) this.quantityInList = 1;
    this.quantityInList = Math.floor(this.quantityInList);
  }
  public hasDefaultColorOption(colors: ColorDto[]): boolean {
    if(colors) return colors.findIndex(c => c.id == 9999) != -1;
    return false;
  }
  public onTabChanged(selectedIndex: number | null, brickId: string): void {
    this.tabIndex = selectedIndex ?? 0;
    if((!this.displayedByList && selectedIndex == 0) || (this.displayedByList && selectedIndex == 1))
      this.tabContentHeight = 180;
    else
      this.tabContentHeight = 122;

    if(this.displayedByList && selectedIndex == 1) {
      this.colorService.getColorsByBrick(brickId)
        .subscribe({
          next: (response) => {
            if(response.isSuccessful) {
              this.availableColors = (response.result as ColorDto[])
                .sort((c1,c2) => c1.name.localeCompare(c2.name));
            }
            else this.responseHandler.errorFromServerResponse(response);
          },
          error: (err: HttpErrorResponse) => {
            this.responseHandler.serverNotRespondingError(err);
          }})
    }
  }

  //CALL API TO EDIT & DELETE BRICK (ADMIN)====================================
  public editBrickClick(id: string): void{
    this.bricksService.getDetails(id).subscribe({
      next: (response) => {
        if(response.isSuccessful) {
          this.matDialog.open(BrickDialogComponent, {
            data: {
              brick: response.result as BrickExtendedDto,
              isNew: false
            }
          });
        }
        else this.responseHandler.errorFromServerResponse(response);
      },
      error: (err: HttpErrorResponse) => {
        this.responseHandler.serverNotRespondingError(err);
      }});
  }
  public deleteBrickClick(id: string): void{
    this.matDialog.open(ConfirmDeleteDialogComponent, {
      data: {
        deleteOption: DeleteOptions.BRICK,
        id: id,
        name: id
      }
    });
  }

  //CALL API TO EDIT BRICK DATA IN LIST (USER)=================================
  public toListBrickClick(id: string): void{
    let toListDto: BrickListDto = {
      brickId: id,
      colorId: this.selectedColor,
      quantity: this.selectedQuantity >= 1 ? Math.floor(this.selectedQuantity) : 1
    }
    this.listService.addBrick(this.selectedListId, toListDto).subscribe({
      next: (response) => {
        if(response.isSuccessful){
          this.responseHandler.serverResponse(response);
          if(this.selectedListId == -1) this.loadLists();
          if(this.listTabOpened) this.listsEventsService.sendChangesInListEvent();
          if(this.listTabOpened && this.selectedListId != -1)
            this.listsEventsService.sendAddedToListListEvent();
        }
        else{
          this.responseHandler.errorFromServerResponse(response);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.responseHandler.serverNotRespondingError(err);
      }});
    this.selectedColor = 9999;
  }
  public editInListClick(brick: BrickDto) {
    let brickListDto: BrickListDto = {
      brickId: brick.id,
      colorId: brick.colors[0] ? brick.colors[0].id : 9999,
      quantity: this.quantityInList >= 1 ? Math.floor(this.quantityInList) : 1
    }
    this.listService.editInList(this.selectedListId, brickListDto).subscribe({
      next: (response) => {
        if(response.isSuccessful){
          this.responseHandler.serverResponse(response);
          let index = this.loadedBricks.findIndex(brick => brick.id == brickListDto.brickId
          && brick.colors[0].id == brickListDto.colorId);
          if(index != -1)this.loadedBricks[index].quantity = brickListDto.quantity;
        }
        else{
          this.responseHandler.errorFromServerResponse(response);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.responseHandler.serverNotRespondingError(err);
      }});
  }
  public deleteFromListClick(brick: BrickDto) {
    let brickListDto: BrickListDeleteDto = {
      brickId: brick.id,
      colorId: brick.colors[0] ? brick.colors[0].id : 9999
    }
    this.listService.deleteFromList(this.selectedListId, brickListDto).subscribe({
      next: (response) => {
        if(response.isSuccessful){
          this.responseHandler.serverResponse(response);
          this.loadedBricks = this.loadedBricks.filter(brick => !(brick.id == brickListDto.brickId
            && brick.colors[0].id == brickListDto.colorId));
          this.bricksToDisplay = this.loadedBricks;
          console.log(this.loadedBricks)
          this.setDataSrc();
          this.listsEventsService.sendChangesInListEvent();
        }
        else{
          this.responseHandler.errorFromServerResponse(response);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.responseHandler.serverNotRespondingError(err);
      }});
  }

  //ngOnDestroy================================================================
  ngOnDestroy(): void {
    this.selectCategoryEventSub.unsubscribe();
    this.listCreatedEventSub.unsubscribe();
    this.listUpdatedEventSub.unsubscribe();
    this.listDeletedEventSub.unsubscribe();
    this.authChangedEventSub.unsubscribe();
    this.roleChangedEventSub.unsubscribe();
    this.filtersAppliedEventSub.unsubscribe();
    this.filtersOffEventSub.unsubscribe();
  }
}
