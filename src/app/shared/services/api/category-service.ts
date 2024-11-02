import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CategoryDto} from "../../models/DTOs/Category/category_dto";
import {AddCategoryDto} from "../../models/DTOs/Category/add_category_dto";
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  CategoriesURL:string='http://localhost:52859/lego_project_api/Categories';
  constructor(private client: HttpClient) { }
  public getCategories():Observable<CategoryDto[]> {
    return this.client.get<CategoryDto[]>(this.CategoriesURL);
  }
  public createCategory(newCategory:AddCategoryDto):Observable<CategoryDto> {
    return this.client.post<CategoryDto>(this.CategoriesURL, newCategory);
  }
}
