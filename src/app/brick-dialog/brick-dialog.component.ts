import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ValidationService} from "../shared/services/tools/validation-service";
import {CategoryDialogData} from "../category-dialog/category-dialog.component";
import {BrickDto} from "../shared/models/DTOs/Brick/brick.dto";
import {CategoryDto} from "../shared/models/DTOs/Category/category.dto";
import {MaterialDto} from "../shared/models/DTOs/Material/material.dto";
import {ColorDto} from "../shared/models/DTOs/Color/color.dto";

export interface BrickDialogData {
  brick: BrickDto;
}
@Component({
  selector: 'app-brick-dialog',
  templateUrl: './brick-dialog.component.html',
  styleUrls: ['./brick-dialog.component.css']
})
export class BrickDialogComponent {
  public brickId: string = '';
  public brickIdValid: boolean = true;
  public invalidBrickIdMessage: string = '';

  public brickName: string = '';
  public brickNameValid: boolean = true;
  public invalidBrickNameMessage: string = '';

  public brickCategory: CategoryDto;
  public brickMaterial: MaterialDto;

  public brickColors: ColorDto[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: BrickDialogData,
    private validationService: ValidationService,
    public dialogRef: MatDialogRef<BrickDialogComponent>
  ) {
    if(this.data.brick.id != '') {
      this.brickId = this.data.brick.id;
      this.brickName = this.data.brick.name;
    }
  }

  saveBrick() {
    if(this.validationService.notEmptyOrSpaces(this.brickName)) {
      this.brickNameValid = true;
    }
    else {
      this.brickNameValid = false;
      this.invalidBrickNameMessage = 'This field is required';
    }

    if(this.brickNameValid) {
      this.data.brick.name = this.brickName;
      this.dialogRef.close(this.data.brick);
    }
  }
}
