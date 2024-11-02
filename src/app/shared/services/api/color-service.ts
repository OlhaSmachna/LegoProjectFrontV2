import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiServiceResponse} from "../../models/DTOs/api-service-response";
@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  MaterialsURL: string='http://localhost:52859/lego_project_api/Materials';
  constructor(private client: HttpClient) {}
  public getMaterials():Observable<ApiServiceResponse> {
    return this.client.get<ApiServiceResponse>(this.MaterialsURL);
  }
}
