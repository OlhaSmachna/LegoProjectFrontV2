import { Injectable } from '@angular/core';
import {ApiServiceResponse} from "../../models/DTOs/api-service-response";
import {HttpHeaders} from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class TokenCheckService {
  public missingTokenResponse: ApiServiceResponse = {
    isSuccessful: false,
    resultMessage: 'Token is missing. Please relogin.',
    errorMessage: '',
    stackTrace: '',
    result: null
  }
  public refreshTokenIsValid(): boolean{
    return localStorage.getItem("refreshToken") != null;
  }
  public createHeaders(): HttpHeaders{
    let token: string = localStorage.getItem("token") ?? '';
    return new HttpHeaders({
      'Accept':'application/json',
      'Content-Type':'application/json',
      "Authorization": "Bearer " + token
    });
  }
}
