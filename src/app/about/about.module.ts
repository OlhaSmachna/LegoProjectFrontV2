import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {AboutComponent} from "./about.component";
import {MatTooltipModule} from "@angular/material/tooltip";

const routes: Routes = [
  {path: '',component: AboutComponent}
]

@NgModule({
  declarations: [AboutComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MatTooltipModule
    ]
})
export class AboutModule { }
