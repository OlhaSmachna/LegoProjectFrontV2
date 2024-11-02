import {Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Observable, Subscriber} from "rxjs";
import {ApiServiceResponse} from "../../DTOs/api-service-response";
import {TokenService} from "../tools/token-service";
import {ListDto} from "../../DTOs/List/list.dto";
import {NewListDto} from "../../DTOs/List/new-list.dto";
import {BrickListDto} from "../../DTOs/Brick/brick-list.dto";
import {BrickListDeleteDto} from "../../DTOs/Brick/brick-list-delete.dto";
import {BackendAddress} from "./BackendAddress";
@Injectable({
  providedIn: 'root'
})
export class ListService {
  private readonly ListsURL: string = '/Lists';
  private readonly ToListURL: string = '/AddBrickTo/';
  private readonly ToListMultiURL: string = '/AddBricksTo/';
  private readonly EditInListURL: string = '/EditIn/';
  private readonly DeleteFromListURL: string = '/DeleteFrom/';
  constructor(
    private client: HttpClient,
    private tokenService: TokenService,
    private backend: BackendAddress
  ) {
    this.ListsURL = backend.get() + this.ListsURL;
    this.ToListURL = this.ListsURL + this.ToListURL;
    this.ToListMultiURL = this.ListsURL + this.ToListMultiURL;
    this.EditInListURL = this.ListsURL + this.EditInListURL;
    this.DeleteFromListURL = this.ListsURL + this.DeleteFromListURL;
  }

  public getLists(): Observable<ApiServiceResponse> {
    if(this.tokenService.refreshTokenIsValid()) {
      const headers = this.tokenService.createHeaders();
      return this.client.get<ApiServiceResponse>(this.ListsURL, {headers: headers});
    }
    else {
      return new Observable<ApiServiceResponse>((subscriber: Subscriber<ApiServiceResponse>) =>
        subscriber.next(this.tokenService.missingTokenResponse));
    }
  }

  public createList(newList:NewListDto):Observable<ApiServiceResponse> {
    if(this.tokenService.refreshTokenIsValid())
    {
      const headers = this.tokenService.createHeaders();
      return this.client.post<ApiServiceResponse>(this.ListsURL, newList, {headers: headers});
    }
    else{
      return new Observable<ApiServiceResponse>((subscriber: Subscriber<ApiServiceResponse>) =>
        subscriber.next(this.tokenService.missingTokenResponse));
    }
  }

  public editList(list:ListDto):Observable<ApiServiceResponse> {
    if(this.tokenService.refreshTokenIsValid())
    {
      const headers = this.tokenService.createHeaders();
      return this.client.put<ApiServiceResponse>(this.ListsURL + '/' + list.id, list, {headers: headers});
    }
    else{
      return new Observable<ApiServiceResponse>((subscriber: Subscriber<ApiServiceResponse>) =>
        subscriber.next(this.tokenService.missingTokenResponse));
    }
  }

  public deleteList(id:number):Observable<ApiServiceResponse> {
    if(this.tokenService.refreshTokenIsValid())
    {
      const headers = this.tokenService.createHeaders();
      return this.client.delete<ApiServiceResponse>(this.ListsURL + '/' + id, {headers: headers});
    }
    else{
      return new Observable<ApiServiceResponse>((subscriber: Subscriber<ApiServiceResponse>) =>
        subscriber.next(this.tokenService.missingTokenResponse));
    }
  }

  public addBrick(listId: number, brick: BrickListDto):Observable<ApiServiceResponse> {
    if(this.tokenService.refreshTokenIsValid())
    {
      const headers = this.tokenService.createHeaders();
      return this.client.post<ApiServiceResponse>(this.ToListURL + listId, brick, {headers: headers});
    }
    else{
      return new Observable<ApiServiceResponse>((subscriber: Subscriber<ApiServiceResponse>) =>
        subscriber.next(this.tokenService.missingTokenResponse));
    }
  }

  public addBricks(listId: number, bricks: BrickListDto[]):Observable<ApiServiceResponse> {
    if(this.tokenService.refreshTokenIsValid())
    {
      const headers = this.tokenService.createHeaders();
      return this.client.post<ApiServiceResponse>(this.ToListMultiURL + listId, bricks, {headers: headers});
    }
    else{
      return new Observable<ApiServiceResponse>((subscriber: Subscriber<ApiServiceResponse>) =>
        subscriber.next(this.tokenService.missingTokenResponse));
    }
  }

  public editInList(listId: number, brick: BrickListDto):Observable<ApiServiceResponse> {
    if(this.tokenService.refreshTokenIsValid())
    {
      const headers = this.tokenService.createHeaders();
      return this.client.post<ApiServiceResponse>(this.EditInListURL + listId, brick, {headers: headers});
    }
    else{
      return new Observable<ApiServiceResponse>((subscriber: Subscriber<ApiServiceResponse>) =>
        subscriber.next(this.tokenService.missingTokenResponse));
    }
  }

  public deleteFromList(listId: number, brick: BrickListDeleteDto):Observable<ApiServiceResponse> {
    if(this.tokenService.refreshTokenIsValid())
    {
      const headers = this.tokenService.createHeaders();
      return this.client.post<ApiServiceResponse>(this.DeleteFromListURL + listId, brick, {headers: headers});
    }
    else{
      return new Observable<ApiServiceResponse>((subscriber: Subscriber<ApiServiceResponse>) =>
        subscriber.next(this.tokenService.missingTokenResponse));
    }
  }
}
