import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CategoryService} from "../shared/services/api/category-service";
import {CategoriesEventsService} from "../shared/services/events/categories-events-service";
import {ValidationService} from "../shared/services/tools/validation-service";
import {ResponseHandler} from "../shared/services/tools/response-handler";
import { HttpErrorResponse } from "@angular/common/http";
import {CategoryDto} from "../shared/DTOs/Category/category.dto";

export interface CategoryDialogData {
  category: CategoryDto;
  isNew: boolean;
}

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.scss']
})
export class CategoryDialogComponent {
  public categoryName: string = '';
  public categoryNameValid: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CategoryDialogData,
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    private categoryService: CategoryService,
    private categoriesEventsService: CategoriesEventsService,
    private validationService: ValidationService,
    public responseHandler: ResponseHandler
    ) {
      this.categoryName = this.data.category.name;
  }

  public saveCategory(): void {
    this.categoryNameValid = this.validationService.notEmptyOrSpaces(this.categoryName);

    if(this.categoryNameValid) {
      this.data.category.name = this.categoryName;
      if(this.data.isNew) {
        this.categoryService.createCategory(this.data.category)
          .subscribe({
            next: (response) => {
              if(response.isSuccessful) {
                this.categoriesEventsService.sendCategoryCreatedEvent(response.result);
                this.responseHandler.serverResponse(response);
                this.dialogRef.close();
              }
              else this.responseHandler.errorFromServerResponse(response);
            },
            error: (err: HttpErrorResponse) => {
              this.responseHandler.serverNotRespondingError(err);
            }})
      }
      else {
        this.categoryService.editCategory(this.data.category)
          .subscribe({
            next: (response) => {
              if(response.isSuccessful) {
                this.categoriesEventsService.sendCategoryUpdatedEvent(response.result);
                this.responseHandler.serverResponse(response);
                this.dialogRef.close();
              }
              else this.responseHandler.errorFromServerResponse(response);
            },
            error: (err: HttpErrorResponse) => {
              this.responseHandler.serverNotRespondingError(err);
            }})
      }
    }
  }
}
