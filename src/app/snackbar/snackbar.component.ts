import {Component, inject, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from "@angular/material/snack-bar";
import {ResponseTypes} from "../shared/services/tools/response-handler";
export interface SnackData {
  message: string;
  responseType: ResponseTypes;
}
@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent {
  public message: string;
  public iconUrl: string;
  public snackBarRef: MatSnackBarRef<any> = inject(MatSnackBarRef);

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: SnackData) {
    this.message = data.message;
    switch (data.responseType){
      case ResponseTypes.NotResponding:
        this.iconUrl = 'assets/icons-active/error.png';
        break;
      case ResponseTypes.Error:
        this.iconUrl = 'assets/icons-active/warning.png';
        break;
      case ResponseTypes.Ok:
        this.iconUrl = 'assets/icons-active/success.png';
        break;
    }
  }
}
