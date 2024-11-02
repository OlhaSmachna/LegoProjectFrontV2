import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {CategoryDto} from "../../DTOs/Category/category.dto";
@Injectable({
  providedIn: 'root'
})
export class CategoriesEventsService {
  private selectedCategory: BehaviorSubject<CategoryDto> = new BehaviorSubject<CategoryDto>({id: -1, name: ''});
  private createdCategory: Subject<CategoryDto> = new Subject<CategoryDto>();
  private updatedCategory: Subject<CategoryDto> = new Subject<CategoryDto>();
  private deletedCategoryId: Subject<number> = new Subject<number>();
  public sendSelectCategoryEvent(selectedCategory: CategoryDto) {
    this.selectedCategory.next(selectedCategory);
  }
  public unselect(): void {
    this.selectedCategory.next({id: -1, name: ''});
  }
  public getSelectCategoryEvent(): Observable<CategoryDto>{
    return this.selectedCategory.asObservable();
  }
  public sendCategoryCreatedEvent(createdCategory:CategoryDto) {
    this.createdCategory.next(createdCategory);
  }
  public getCategoryCreatedEvent(): Observable<CategoryDto>{
    return this.createdCategory.asObservable();
  }
  public sendCategoryUpdatedEvent(updatedCategory:CategoryDto) {
    this.updatedCategory.next(updatedCategory);
  }
  public getCategoryUpdatedEvent(): Observable<CategoryDto>{
    return this.updatedCategory.asObservable();
  }
  public sendCategoryDeletedEvent(deletedCategoryID:number) {
    this.deletedCategoryId.next(deletedCategoryID);
  }
  public getCategoryDeletedEvent(): Observable<number>{
    return this.deletedCategoryId.asObservable();
  }
}
