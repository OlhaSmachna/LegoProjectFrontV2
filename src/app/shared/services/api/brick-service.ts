import {Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Observable, Subscriber} from "rxjs";
import {ApiServiceResponse} from "../../DTOs/api-service-response";
import {TokenService} from "../tools/token-service";
import {SearchDto} from "../../DTOs/Brick/search.dto";
import {BrickExtendedDto} from "../../DTOs/Brick/brick-extended.dto";
import {BackendAddress} from "./BackendAddress";
@Injectable({
  providedIn: 'root'
})
export class BricksService {
  private readonly BricksURL: string = '/Bricks';
  private readonly BricksByCategoryURL: string = '/ByCategory/';
  private readonly BricksByListURL: string = '/ByList/';
  private readonly BricksDetailsURL: string = '/Details/';
  private readonly BricksSearchURL: string = '/Search';

  constructor(
    private client: HttpClient,
    private tokenService: TokenService,
    private backend: BackendAddress
  ) {
    this.BricksURL = backend.get() + this.BricksURL;
    this.BricksByCategoryURL = this.BricksURL + this.BricksByCategoryURL;
    this.BricksByListURL = this.BricksURL + this.BricksByListURL;
    this.BricksDetailsURL = this.BricksURL + this.BricksDetailsURL;
    this.BricksSearchURL = this.BricksURL + this.BricksSearchURL;
  }

  public getBricksAllOrByCategory(categoryId: number):Observable<ApiServiceResponse> {
    if(categoryId == 0)
      return this.client.get<ApiServiceResponse>(this.BricksURL);
    else
      return this.client.get<ApiServiceResponse>(this.BricksByCategoryURL + categoryId);
  }

  public getBricksByList(listId: number):Observable<ApiServiceResponse> {
    if(this.tokenService.refreshTokenIsValid()) {
      const headers = this.tokenService.createHeaders();
      return this.client.get<ApiServiceResponse>(this.BricksByListURL + listId, {headers: headers});
    }
    else{
      return new Observable<ApiServiceResponse>((subscriber: Subscriber<ApiServiceResponse>) =>
        subscriber.next(this.tokenService.missingTokenResponse));
    }
  }

  public searchBricks(pattern: SearchDto):Observable<ApiServiceResponse> {
    return this.client.post<ApiServiceResponse>(this.BricksSearchURL, pattern);
  }

  public getDetails(id: string):Observable<ApiServiceResponse> {
    return this.client.get<ApiServiceResponse>(this.BricksDetailsURL + id);
  }

  public createBrick(newBrick: BrickExtendedDto):Observable<ApiServiceResponse> {
    if(this.tokenService.refreshTokenIsValid()) {
      const headers = this.tokenService.createHeaders();
      return this.client.post<ApiServiceResponse>(this.BricksURL, newBrick, {headers: headers});
    }
    else{
      return new Observable<ApiServiceResponse>((subscriber: Subscriber<ApiServiceResponse>) =>
        subscriber.next(this.tokenService.missingTokenResponse));
    }
  }

  public editBrick(brick: BrickExtendedDto):Observable<ApiServiceResponse> {
    if(this.tokenService.refreshTokenIsValid()) {
      const headers = this.tokenService.createHeaders();
      return this.client.put<ApiServiceResponse>(this.BricksURL +'/'+ brick.id, brick, {headers: headers});
    }
    else{
      return new Observable<ApiServiceResponse>((subscriber: Subscriber<ApiServiceResponse>) =>
        subscriber.next(this.tokenService.missingTokenResponse));
    }
  }

  public deleteBrick(id: string):Observable<ApiServiceResponse> {
    if(this.tokenService.refreshTokenIsValid())
    {
      const headers = this.tokenService.createHeaders();
      return this.client.delete<ApiServiceResponse>(this.BricksURL + '/' + id, {headers: headers});
    }
    else{
      return new Observable<ApiServiceResponse>((subscriber: Subscriber<ApiServiceResponse>) =>
        subscriber.next(this.tokenService.missingTokenResponse));
    }
  }
}
