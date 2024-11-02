import {Injectable} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";

@Injectable()
export class SidenavService {
  private sidenav!: MatSidenav;

  public setSidenav(sidenav: MatSidenav) {
    this.sidenav = sidenav;
  }
  public open(): void {
    this.sidenav.open();
  }
  public close(): void {
    this.sidenav.close();
  }
}
