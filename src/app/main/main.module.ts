import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {MatTableModule} from '@angular/material/table';

import {BricksComponent} from "./bricks.component";
import {MatSortModule} from "@angular/material/sort";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatTooltipModule} from "@angular/material/tooltip";
import {TableComponent} from "../table/table.component";
import {CategoriesComponent} from "../categories/categories.component";
import {MatListModule} from "@angular/material/list";

const routes:Routes=[
  {path:'',component: BricksComponent}
]

@NgModule({
  declarations: [
    BricksComponent,
    TableComponent,
    CategoriesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTableModule,
    MatSortModule,
    MatSidenavModule,
    MatTooltipModule,
    MatListModule
  ]
})
export class BricksModule { }
