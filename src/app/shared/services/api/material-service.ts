import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiServiceResponse} from "../../DTOs/api-service-response";
import {BackendAddress} from "./BackendAddress";
@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private readonly MaterialsURL: string = '/Materials';
  constructor(private client: HttpClient,
              private backend: BackendAddress) {
    this.MaterialsURL = backend.get() + this.MaterialsURL;
  }
  public getMaterials():Observable<ApiServiceResponse> {
    return this.client.get<ApiServiceResponse>(this.MaterialsURL);
  }
}
