import {importProvidersFrom, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from "@angular/material/sort";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatListModule} from "@angular/material/list";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatCardModule} from "@angular/material/card";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatSelectModule} from "@angular/material/select";
import {MatTabsModule} from "@angular/material/tabs";
import {FormsModule} from "@angular/forms";
import {CloudinaryModule} from "@cloudinary/ng";

import {MainComponent} from "./main.component";
import {MenuComponent} from "../menu/menu.component";
import {TableComponent} from "../table/table.component";
import {CategoriesComponent} from "../categories/categories.component";
import {FiltersComponent} from "../filters/filters.component";
import {ListsComponent} from "../lists/lists.component";
import {CategoryDialogComponent} from "../category-dialog/category-dialog.component";
import {ListDialogComponent} from "../list-dialog/list-dialog.component";
import {BrickDialogComponent} from '../brick-dialog/brick-dialog.component';
import {ConfirmDeleteDialogComponent} from "../confirm-delete-dialog/confirm-delete-dialog.component";
import {UploadDialogComponent} from '../upload-dialog/upload-dialog.component';
import {MenuBtnDirective} from "../shared/directives/menu-btn.directive";
import {NgxChartsModule} from "@swimlane/ngx-charts";

const routes:Routes=[
  {path:'',component: MainComponent},
  {path: 'dev', loadChildren: () => import('../dev-dialog/dev-dialog.module').then(m => m.DevDialogModule)}
]

@NgModule({
    declarations: [
        MainComponent,
        MenuComponent,
        TableComponent,
        CategoriesComponent,
        FiltersComponent,
        ListsComponent,
        CategoryDialogComponent,
        ListDialogComponent,
        BrickDialogComponent,
        ConfirmDeleteDialogComponent,
        UploadDialogComponent,
        MenuBtnDirective
    ],
    exports: [
        MenuBtnDirective
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MatTableModule,
        MatSortModule,
        MatSidenavModule,
        MatExpansionModule,
        MatCardModule,
        MatListModule,
        MatDialogModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressBarModule,
        MatTooltipModule,
        MatSlideToggleModule,
        CloudinaryModule,
        MatSelectModule,
        MatTabsModule
    ],
    providers:[importProvidersFrom([NgxChartsModule])]
})
export class MainModule { }
