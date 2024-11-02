import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {CategoryDto} from "../../models/DTOs/Category/category.dto";
import {ListsEventsService} from "./lists-events-service";
@Injectable({
  providedIn: 'root'
})
export class CategoriesEventsService {
  private selectedCategory = new BehaviorSubject<CategoryDto>({id: -1, name: ''});
  private createdCategory = new Subject<CategoryDto>();
  private updatedCategory = new Subject<CategoryDto>();
  private deletedCategoryId = new Subject<number>();
  sendSelectCategoryEvent(selectedCategory: CategoryDto) {
    this.selectedCategory.next(selectedCategory);
  }
  unselect() {
    this.selectedCategory.next({id: -1, name: ''});
  }
  getSelectCategoryEvent(): Observable<CategoryDto>{
    return this.selectedCategory.asObservable();
  }
  sendCategoryCreatedEvent(createdCategory:CategoryDto) {
    this.createdCategory.next(createdCategory);
  }
  getCategoryCreatedEvent(): Observable<CategoryDto>{
    return this.createdCategory.asObservable();
  }
  sendCategoryUpdatedEvent(updatedCategory:CategoryDto) {
    this.updatedCategory.next(updatedCategory);
  }
  getCategoryUpdatedEvent(): Observable<CategoryDto>{
    return this.updatedCategory.asObservable();
  }
  sendCategoryDeletedEvent(deletedCategoryID:number) {
    this.deletedCategoryId.next(deletedCategoryID);
  }
  getCategoryDeletedEvent(): Observable<number>{
    return this.deletedCategoryId.asObservable();
  }
}
