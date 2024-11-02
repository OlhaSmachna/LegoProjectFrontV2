import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiServiceResponse} from "../../models/DTOs/api-service-response";
@Injectable({
  providedIn: 'root'
})
export class ColorService {
  ColorsURL: string='http://localhost:52859/lego_project_api/Colors';
  constructor(private client: HttpClient) {}
  public getColors():Observable<ApiServiceResponse> {
    return this.client.get<ApiServiceResponse>(this.ColorsURL);
  }
}
