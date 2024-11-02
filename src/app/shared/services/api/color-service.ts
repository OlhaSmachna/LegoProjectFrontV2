import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiServiceResponse} from "../../DTOs/api-service-response";
import {BackendAddress} from "./BackendAddress";
@Injectable({
  providedIn: 'root'
})
export class ColorService {
  private readonly ColorsURL: string = '/Colors';
  private readonly ColorsByBrickURL: string = '/ByBrick/';
  constructor(private client: HttpClient,
              private backend: BackendAddress) {
    this.ColorsURL = backend.get() + this.ColorsURL;
    this.ColorsByBrickURL = this.ColorsURL + this.ColorsByBrickURL;
  }
  public getColors():Observable<ApiServiceResponse> {
    return this.client.get<ApiServiceResponse>(this.ColorsURL);
  }
  public getColorsByBrick(brickId: string):Observable<ApiServiceResponse> {
    return this.client.get<ApiServiceResponse>(this.ColorsByBrickURL + brickId);
  }
}
