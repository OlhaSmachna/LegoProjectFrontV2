import {Component, OnDestroy, OnInit} from '@angular/core';
import { HttpErrorResponse } from "@angular/common/http";
import {CategoryService} from "../shared/services/api/category-service";
import {CategoryDto} from "../shared/DTOs/Category/category.dto";
import {CategoriesEventsService} from "../shared/services/events/categories-events-service";
import {Subscription} from "rxjs";
import {ResponseHandler} from "../shared/services/tools/response-handler";
import {ListsEventsService} from "../shared/services/events/lists-events-service";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy{
  public categories: CategoryDto[] = [];
  public emptyCategory: CategoryDto = {id: 0, name: ''};
  public selectedCategory: CategoryDto = {id: 0, name: ''};
  private selectCategoryEventSub: Subscription = new Subscription();
  private categoryCreatedEventSub: Subscription = new Subscription();
  private categoryUpdatedEventSub: Subscription = new Subscription();
  private categoryDeletedEventSub: Subscription = new Subscription();
  public isLoading: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private categoriesEventsService: CategoriesEventsService,
    private listsEventsService: ListsEventsService,
    public httpResponseHandler: ResponseHandler
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.selectCategoryEventSub = this.categoriesEventsService.getSelectCategoryEvent().subscribe(cat => {
      this.selectedCategory = cat;
    });
    this.categoryCreatedEventSub = this.categoriesEventsService.getCategoryCreatedEvent().subscribe(cat => {
      if (cat.id != 0) this.categories.push(cat);
      this.sortCategories();
    });
    this.categoryUpdatedEventSub = this.categoriesEventsService.getCategoryUpdatedEvent().subscribe(cat => {
      if (cat.id != 0) {
        let index = this.categories.findIndex(category => category.id == cat.id);
        if(index != -1)this.categories[index].name = cat.name;
      }
      this.sortCategories();
    });
    this.categoryDeletedEventSub = this.categoriesEventsService.getCategoryDeletedEvent().subscribe(catId => {
      if (catId != 0) this.categories = this.categories.filter(cat => cat.id != catId);
      this.sortCategories();
    });

    this.categoryService.getCategories()
      .subscribe({
        next: (response) => {
          if(response.isSuccessful) {
            this.categories = response.result as CategoryDto[];
            this.categories.forEach(c => {
              c.name = c.name.replaceAll("\"","");
            });
            this.sortCategories();
            this.isLoading = false;
          }
          else this.httpResponseHandler.errorFromServerResponse(response);
        },
        error: (err: HttpErrorResponse) => {
          this.httpResponseHandler.serverNotRespondingError(err);
        }})
  }

  public selectCategory(selectedCategory: CategoryDto): void{
    this.selectedCategory = selectedCategory;
    this.categoriesEventsService.sendSelectCategoryEvent(this.selectedCategory);
    this.listsEventsService.unselect();
  }
  private sortCategories(): void{
    this.categories = this.categories.sort((c1,c2) => c1.name.localeCompare(c2.name));
  }

  ngOnDestroy(): void {
    this.selectCategoryEventSub.unsubscribe();
    this.categoryCreatedEventSub.unsubscribe();
    this.categoryUpdatedEventSub.unsubscribe();
    this.categoryDeletedEventSub.unsubscribe();
  }
}
