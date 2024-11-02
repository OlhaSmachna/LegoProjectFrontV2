import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ValidationService} from "../shared/services/tools/validation-service";
import {CategoryDto} from "../shared/DTOs/Category/category.dto";
import {MaterialDto} from "../shared/DTOs/Material/material.dto";
import {ColorDto} from "../shared/DTOs/Color/color.dto";
import { HttpErrorResponse } from "@angular/common/http";
import {CategoryService} from "../shared/services/api/category-service";
import {ResponseHandler} from "../shared/services/tools/response-handler";
import {MaterialService} from "../shared/services/api/material-service";
import {ColorService} from "../shared/services/api/color-service";
import {BrickExtendedDto} from "../shared/DTOs/Brick/brick-extended.dto";
import {BricksService} from "../shared/services/api/brick-service";
import {BtnImagesUrls} from "../shared/data/btn-images-urls";
import {CloudinaryImage} from "@cloudinary/url-gen";
import {CloudService} from "../shared/services/tools/cloud-service";
import {BricksEventsService} from "../shared/services/events/bricks-events-service";
import {BrickDto} from "../shared/DTOs/Brick/brick.dto";

export interface BrickDialogData {
  brick: BrickExtendedDto;
  isNew: boolean;
}
@Component({
  selector: 'app-brick-dialog',
  templateUrl: './brick-dialog.component.html',
  styleUrls: ['./brick-dialog.component.scss']
})
export class BrickDialogComponent implements OnInit{
  //INPUT-INFO======================================
  public brickIdValid: boolean = true;
  public brickNameValid: boolean = true;
  public firstSelectedColorName: string = '';

  //SELECT-INFO======================================
  public categories: CategoryDto[] = [];
  public materials: MaterialDto[] = [];
  public colors: ColorDto[] = [];

  //IMAGE_INFO======================================
  private EMPTY_IMG_SRC: string = 'assets/images/noImg.png';
  public imageSrc: string;
  public isOriginalImage: boolean = false;
  public imageFromCloud: CloudinaryImage;
  private uploadedFile: File | undefined;
  public isLoading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: BrickDialogData,
    public dialogRef: MatDialogRef<BrickDialogComponent>,
    private bricksService: BricksService,
    private categoryService: CategoryService,
    private materialService: MaterialService,
    private bricksEventsService: BricksEventsService,
    private colorService: ColorService,
    private validationService: ValidationService,
    public cloudService: CloudService,
    public responseHandler: ResponseHandler,
    public btnUrls: BtnImagesUrls,
  ) {}

  ngOnInit(): void {
    if (this.cloudService.USE_CLOUD && this.data.brick.hasImage) {
      this.isOriginalImage = true;
      if(this.data.brick.imageVersion != 0){
        this.imageFromCloud = this.cloudService.getImageWithVersion(this.data.brick.id, this.data.brick.imageVersion, 200);
      }
      else {
        this.imageFromCloud = this.cloudService.getImage(this.data.brick.id, 200);
      }
    }
    else this.imageSrc = this.EMPTY_IMG_SRC;

    this.categoryService.getCategories()
      .subscribe({
        next: (response) => {
          if(response.isSuccessful) {
            this.categories = response.result as CategoryDto[];
            this.categories.forEach(c => {c.name = c.name.replaceAll("\"","");});
            this.categories.sort((c1,c2) => c1.name.localeCompare(c2.name));
            if(this.data.isNew || this.data.brick.categoryID == 0)
              this.data.brick.categoryID = this.categories[0].id;
          }
          else this.responseHandler.errorFromServerResponse(response);
        },
        error: (err: HttpErrorResponse) => {
          this.responseHandler.serverNotRespondingError(err);
        }})

    this.materialService.getMaterials()
      .subscribe({
        next: (response) => {
          if(response.isSuccessful) {
            this.materials = (response.result as MaterialDto[])
              .sort((m1,m2) => m1.name.localeCompare(m2.name));
            if(this.data.isNew) this.data.brick.materialID = this.materials[0].id;
          }
          else this.responseHandler.errorFromServerResponse(response);
        },
        error: (err: HttpErrorResponse) => {
          this.responseHandler.serverNotRespondingError(err);
        }})

    this.colorService.getColors()
      .subscribe({
        next: (response) => {
          if(response.isSuccessful) {
            this.colors = (response.result as ColorDto[])
              .sort((c1,c2) => c1.name.localeCompare(c2.name));
            if(!this.data.isNew) {
              if(this.data.brick.colorIDs.length != 0)
                this.firstSelectedColorName = this.colors[this.colors.findIndex(c => c.id == this.data.brick.colorIDs[0])].name;
            }
          }
          else this.responseHandler.errorFromServerResponse(response);
        },
        error: (err: HttpErrorResponse) => {
          this.responseHandler.serverNotRespondingError(err);
        }})
  }

  public saveBrick(): void {
    this.brickIdValid = this.validationService.notEmptyOrSpaces(this.data.brick.id);
    this.brickNameValid = this.validationService.notEmptyOrSpaces(this.data.brick.name);

    if(this.brickIdValid && this.brickNameValid) {
      this.isLoading = true;
      if(this.data.brick.hasImage && !this.isOriginalImage && this.uploadedFile){
        this.cloudService.uploadImage(this.uploadedFile, this.data.brick.id).then(cloudResponse => {
          let cloudResponseJson = JSON.parse(cloudResponse);
          this.data.brick.imageVersion = cloudResponseJson.version;
          if(this.data.isNew) {
            this.bricksService.createBrick(this.data.brick)
              .subscribe({
                next: (response) => {
                  if(response.isSuccessful && (response.result as BrickDto).name != null) {
                    this.responseHandler.serverResponse(response);
                    this.isLoading = false;
                    this.dialogRef.close();
                  }
                  else this.responseHandler.errorFromServerResponse(response);
                },
                error: (err: HttpErrorResponse) => {
                  this.responseHandler.serverNotRespondingError(err);
                }})
          }
          else {
            this.bricksService.editBrick(this.data.brick)
              .subscribe({
                next: (response) => {
                  if(response.isSuccessful && (response.result as BrickDto).name != null) {
                    this.responseHandler.serverResponse(response);
                    this.bricksEventsService.sendBrickUpdatedEvent(response.result);
                    this.isLoading = false;
                    this.dialogRef.close();
                  }
                  else {
                    if(response.errorMessage != null) this.responseHandler.errorFromServerResponse(response);
                    else this.dialogRef.close();
                  }
                },
                error: (err: HttpErrorResponse) => {
                  this.responseHandler.serverNotRespondingError(err);
                }})
          }
        });
      }
      else {
        if(this.data.isNew) {
          this.data.brick.imageVersion = 0;
          this.bricksService.createBrick(this.data.brick)
            .subscribe({
              next: (response) => {
                if(response.isSuccessful && (response.result as BrickDto).name != null) {
                  this.responseHandler.serverResponse(response);
                  this.isLoading = false;
                  this.dialogRef.close();
                }
                else this.responseHandler.errorFromServerResponse(response);
              },
              error: (err: HttpErrorResponse) => {
                this.responseHandler.serverNotRespondingError(err);
              }})
        }
        else {
          this.bricksService.editBrick(this.data.brick)
            .subscribe({
              next: (response) => {
                if(response.isSuccessful && (response.result as BrickDto).name != null) {
                  this.responseHandler.serverResponse(response);
                  this.bricksEventsService.sendBrickUpdatedEvent(response.result);
                  this.isLoading = false;
                  this.dialogRef.close();
                }
                else {
                  if(response.errorMessage != null) this.responseHandler.errorFromServerResponse(response);
                  else this.dialogRef.close();
                }
              },
              error: (err: HttpErrorResponse) => {
                this.responseHandler.serverNotRespondingError(err);
              }})
        }
      }
    }
  }

  public onFileInput($event: Event): void {
    this.uploadedFile = ($event.target as HTMLInputElement)?.files?.[0];
    if (this.uploadedFile) {
      const reader = new FileReader();
      reader.onload = () => this.imageSrc = reader.result ? reader.result.toString() : '';
      reader.readAsDataURL(this.uploadedFile);
      this.isOriginalImage = false;
      this.data.brick.hasImage = true;
    }
  }

  public removeImage(): void {
    this.data.brick.hasImage = false;
    this.imageSrc = this.EMPTY_IMG_SRC;
  }

  public onColorSelected(): void {
    if(this.data.brick.colorIDs.length == 1)
      this.firstSelectedColorName = this.colors[this.colors.findIndex(c => c.id == this.data.brick.colorIDs[0])].name;
  }
}
