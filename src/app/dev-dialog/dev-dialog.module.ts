import {NgModule} from '@angular/core';
import { DevDialogComponent } from './dev-dialog.component';
import {CdkDrag} from "@angular/cdk/drag-drop";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {MatDividerModule} from "@angular/material/divider";
import {RouterModule, Routes} from "@angular/router";
import {CommonModule} from "@angular/common";
import {AreaChartModule} from "@swimlane/ngx-charts";
import {MatTabsModule} from "@angular/material/tabs";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";

const routes: Routes = [
  {  path: '',component:  DevDialogComponent },
];
@NgModule({
  declarations: [
    DevDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatDialogModule,
    MatDividerModule,
    CdkDrag,
    MatButtonModule,
    AreaChartModule,
    MatTabsModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatOptionModule,
    MatSelectModule,
  ]
})
export class DevDialogModule {}
