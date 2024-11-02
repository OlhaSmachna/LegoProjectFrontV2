import {Injectable} from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class BackendAddress {
  private ADDRESS: string = 'http://localhost:5000/lego_project_api';
  public get(): string {
    return this.ADDRESS;
  }
}
