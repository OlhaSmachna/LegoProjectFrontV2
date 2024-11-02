import { Injectable } from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {ApiServiceResponse} from "../../models/DTOs/api-service-response";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackbarComponent} from "../../../snackbar/snackbar.component";
import { Router } from '@angular/router';

export enum ResponseTypes {
  NotResponding,
  Error,
  Ok
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandler {
  constructor(
    private _snackBar: MatSnackBar,
    private router: Router
    ) {}

  public serverNotRespondingError(err: HttpErrorResponse):void{
    this.router.navigate(['bricks_manager/server_down']);
  }

  public errorFromServerResponse(response:ApiServiceResponse): void{
    if(response.errorMessage != '' && response.errorMessage != null) console.log(response.errorMessage);
    if(response.stackTrace != null) console.log(response.stackTrace);
    this.snack({
      message: response.resultMessage,
      responseType: ResponseTypes.Error
    }, 5000);
  }

  public errorLocal(message: string): void{
    this.snack({
      message: message,
      responseType: ResponseTypes.Error
    }, 5000);
  }

  public serverResponse(response:ApiServiceResponse): void{
    this.snack({
      message: response.resultMessage,
      responseType: ResponseTypes.Ok
    }, 1000);
  }

  private snack(data: {message: string, responseType: ResponseTypes}, duration: number): void{
    this._snackBar.openFromComponent(SnackbarComponent, {
      duration: duration,
      horizontalPosition: "right",
      verticalPosition: "top",
      data: data
    });
  }
}
