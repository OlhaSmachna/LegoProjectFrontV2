import {Component, Inject} from '@angular/core';
import {CategoryDto} from "../shared/models/DTOs/Category/category.dto";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ValidationService} from "../shared/services/tools/validation-service";
export interface CategoryDialogData {
  category: CategoryDto;
}
@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.scss']
})
export class CategoryDialogComponent {
  public categoryName: string = '';
  public categoryNameValid: boolean = true;
  public invalidCategoryNameMessage: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CategoryDialogData,
    private validationService: ValidationService,
    public dialogRef: MatDialogRef<CategoryDialogComponent>
    ) {
    if(this.data.category.id != 0){
      this.categoryName = this.data.category.name;
    }
  }

  saveCategory() {
    if(this.validationService.notEmptyOrSpaces(this.categoryName))
    {
      this.categoryNameValid = true;
    }
    else {
      this.categoryNameValid = false;
      this.invalidCategoryNameMessage = 'This field is required';
    }
    if(this.categoryNameValid){
      this.data.category.name = this.categoryName;
      this.dialogRef.close(this.data.category);
    }
  }
}
