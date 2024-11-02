import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, Subscriber} from "rxjs";
import {CategoryDto} from "../../models/DTOs/Category/category.dto";
import {AddCategoryDto} from "../../models/DTOs/Category/add-category.dto";
import {ApiServiceResponse} from "../../models/DTOs/api-service-response";
import {TokenCheckService} from "../token-check-service";
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  CategoriesURL: string='http://localhost:52859/lego_project_api/Categories';
  constructor(
    private client: HttpClient,
    private tokenCheck: TokenCheckService
  ) {}
  public getCategories():Observable<ApiServiceResponse> {
    return this.client.get<ApiServiceResponse>(this.CategoriesURL);
  }
  public createCategory(newCategory:AddCategoryDto):Observable<ApiServiceResponse> {
    if(this.tokenCheck.tokenIsValid())
    {
      const headers = this.tokenCheck.createHeaders();
      return this.client.post<ApiServiceResponse>(this.CategoriesURL, newCategory, {headers: headers});
    }
    else{
      return new Observable<ApiServiceResponse>((subscriber: Subscriber<ApiServiceResponse>) =>
        subscriber.next(this.tokenCheck.missingTokenResponse));
    }
  }

  public editCategory(category:CategoryDto):Observable<ApiServiceResponse> {
    if(this.tokenCheck.tokenIsValid())
    {
      const headers = this.tokenCheck.createHeaders();
      return this.client.put<ApiServiceResponse>(this.CategoriesURL + '/' + category.id, category, {headers: headers});
    }
    else{
      return new Observable<ApiServiceResponse>((subscriber: Subscriber<ApiServiceResponse>) =>
        subscriber.next(this.tokenCheck.missingTokenResponse));
    }
  }
  public deleteCategory(id:number):Observable<ApiServiceResponse> {
    if(this.tokenCheck.tokenIsValid())
    {
      const headers = this.tokenCheck.createHeaders();
      return this.client.delete<ApiServiceResponse>(this.CategoriesURL + '/' + id, {headers: headers});
    }
    else{
      return new Observable<ApiServiceResponse>((subscriber: Subscriber<ApiServiceResponse>) =>
        subscriber.next(this.tokenCheck.missingTokenResponse));
    }
  }
}
