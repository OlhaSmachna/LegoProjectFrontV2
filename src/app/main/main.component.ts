import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {MatSidenav} from "@angular/material/sidenav";
import {SidenavService} from "../shared/services/tools/sidenav-service";
import {MenuOptions} from "../menu/menu.component";
import {UserService} from "../shared/services/api/user-service";
import {MenuEventsService} from "../shared/services/events/menu-events-service";
import {RouterEventsService} from "../shared/services/events/router-events-service";
import {UserEventsService} from "../shared/services/events/user-events-service";
import { HttpErrorResponse } from "@angular/common/http";
import {ResponseHandler} from "../shared/services/tools/response-handler";
import {Router} from "@angular/router";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit, AfterViewInit, OnDestroy{
  @ViewChild('sidenav')
  public sidenav!: MatSidenav;
  public activeTab: MenuOptions = MenuOptions.Categories;
  public isUserAuthenticated: boolean = false;
  private redirectFromLogin: boolean = false;
  public isMenuOpened: boolean;
  private tabChangedEventSub: Subscription = new Subscription();
  private menuToggleEventSub: Subscription = new Subscription();
  private roteParamChangeEventSub: Subscription = new Subscription();
  private authChangedEventSub: Subscription = new Subscription();
  public get MenuOptions(): typeof MenuOptions {
    return MenuOptions;
  }

  constructor(
    private userService: UserService,
    private sidenavService: SidenavService,
    private userEventsService: UserEventsService,
    private menuEventsService: MenuEventsService,
    private routerEventsService: RouterEventsService,
    private router: Router,
    private responseHandler: ResponseHandler
    ) {}

  ngOnInit(): void {
    this.tabChangedEventSub = this.menuEventsService.getTabChangedEvent().subscribe(tab => {
      this.activeTab = tab;
    });
    this.menuToggleEventSub = this.menuEventsService.getMenuToggleEvent().subscribe(state => {
      this.isMenuOpened = state;
    });
    this.authChangedEventSub = this.userEventsService.getAuthStateChangeNotification().subscribe(state => {
      this.isUserAuthenticated = state;
    });
    this.roteParamChangeEventSub = this.routerEventsService.getRouteParam().subscribe(param => {
      if(param) {
        this.redirectFromLogin = param;
        this.routerEventsService.setRouteParam(false);
      }
    });

    if(!this.redirectFromLogin) {
      this.userService.tryRefreshTokens().subscribe({
        next: (response) => {
          if(response.isSuccessful)
            this.userEventsService.sendSuccessfulLoginNotification(response.result);
          else
            this.userEventsService.sendLogoutNotification();
          return response.isSuccessful;
        },
        error: (err: HttpErrorResponse) => {
          this.userEventsService.sendLogoutNotification();
          this.responseHandler.serverNotRespondingError(err);
        }})
    }
  }

  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
  }

  public isLargeScreen(): boolean {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    return width > 720;
  }

  ngOnDestroy(): void {
    this.tabChangedEventSub.unsubscribe();
    this.menuToggleEventSub.unsubscribe();
    this.authChangedEventSub.unsubscribe();
    this.roteParamChangeEventSub.unsubscribe();
  }
}
