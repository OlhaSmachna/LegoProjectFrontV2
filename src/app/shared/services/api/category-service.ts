import {Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Observable, Subscriber} from "rxjs";
import {CategoryDto} from "../../DTOs/Category/category.dto";
import {NewCategoryDto} from "../../DTOs/Category/new-category.dto";
import {ApiServiceResponse} from "../../DTOs/api-service-response";
import {TokenService} from "../tools/token-service";
import {BackendAddress} from "./BackendAddress";
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly CategoriesURL: string = '/Categories';
  constructor(
    private client: HttpClient,
    private tokenService: TokenService,
    private backend: BackendAddress
  ) {
    this.CategoriesURL = backend.get() + this.CategoriesURL;
  }

  public getCategories():Observable<ApiServiceResponse> {
    return this.client.get<ApiServiceResponse>(this.CategoriesURL);
  }

  public createCategory(newCategory:NewCategoryDto):Observable<ApiServiceResponse> {
    if(this.tokenService.refreshTokenIsValid())
    {
      const headers = this.tokenService.createHeaders();
      return this.client.post<ApiServiceResponse>(this.CategoriesURL, newCategory, {headers: headers});
    }
    else{
      return new Observable<ApiServiceResponse>((subscriber: Subscriber<ApiServiceResponse>) =>
        subscriber.next(this.tokenService.missingTokenResponse));
    }
  }

  public editCategory(category:CategoryDto):Observable<ApiServiceResponse> {
    if(this.tokenService.refreshTokenIsValid())
    {
      const headers = this.tokenService.createHeaders();
      return this.client
        .put<ApiServiceResponse>(this.CategoriesURL + '/' + category.id, category, {headers: headers});
    }
    else{
      return new Observable<ApiServiceResponse>((subscriber: Subscriber<ApiServiceResponse>) =>
        subscriber.next(this.tokenService.missingTokenResponse));
    }
  }

  public deleteCategory(id:number):Observable<ApiServiceResponse> {
    if(this.tokenService.refreshTokenIsValid())
    {
      const headers = this.tokenService.createHeaders();
      return this.client.delete<ApiServiceResponse>(this.CategoriesURL + '/' + id, {headers: headers});
    }
    else{
      return new Observable<ApiServiceResponse>((subscriber: Subscriber<ApiServiceResponse>) =>
        subscriber.next(this.tokenService.missingTokenResponse));
    }
  }
}
