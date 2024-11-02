import {NgModule} from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule, Routes} from "@angular/router";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";

import {AppComponent} from './app.component';
import {SnackbarComponent} from './snackbar/snackbar.component';
import {Page404Component} from './page404/page404.component';
import {ServerDownComponent} from './server-down/server-down.component';

import {SidenavService} from "./shared/services/tools/sidenav-service";
import {TokenInterceptor} from "./shared/services/interceptors/token-interceptor";
import {HttpLogInterceptor} from "./shared/services/interceptors/http-log-interceptor";

const routes: Routes = [
  {path: 'bricks_manager/login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule)},
  {path: 'bricks_manager/register', loadChildren: () => import('./register/register.module').then(m => m.RegisterModule)},
  {path: 'bricks_manager/bricks', loadChildren: () => import('./main/main.module').then(m => m.MainModule)},
  {path: 'bricks_manager/about', loadChildren: () => import('./about/about.module').then(m => m.AboutModule)},
  {path: 'bricks_manager/server_down', component: ServerDownComponent},
  {path: '', redirectTo: 'bricks_manager/bricks', pathMatch: 'full'},
  {path: '**', component: Page404Component}
]
@NgModule({ declarations: [
        AppComponent,
        SnackbarComponent,
        Page404Component,
        ServerDownComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        RouterModule.forRoot(routes),
        BrowserAnimationsModule,
        MatSnackBarModule,
        MatButtonModule,
        FormsModule,
        MatInputModule], providers: [
        SidenavService,
        MatSnackBar,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpLogInterceptor,
            multi: true
        },
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }
