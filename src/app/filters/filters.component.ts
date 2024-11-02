import {Component, OnDestroy, OnInit} from '@angular/core';
import {MaterialService} from "../shared/services/api/material-service";
import {ColorService} from "../shared/services/api/color-service";
import {FiltersData, FiltersEventsService} from "../shared/services/events/filters-events-service";
import {ResponseHandler} from "../shared/services/tools/response-handler";
import { HttpErrorResponse } from "@angular/common/http";
import {Subscription} from "rxjs";
import {ColorDto} from "../shared/DTOs/Color/color.dto";
import {MaterialDto} from "../shared/DTOs/Material/material.dto";
@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit, OnDestroy{
  public materials: MaterialDto[] = [];
  public colors: ColorDto[] = [];
  public selectedMaterials: MaterialDto[] = [];
  public selectedColors: ColorDto[] = [];
  public selectedIsTransparent: boolean[] = [];
  public isFiltersApplied: boolean = false;
  private filtersOffEventSub = new Subscription();
  public isLoading: boolean = false;

  constructor(
    private materialService: MaterialService,
    private colorService: ColorService,
    private responseHandler: ResponseHandler,
    private filtersEventsService: FiltersEventsService
  ) {}

  ngOnInit(): void {
    this.filtersOffEventSub = this.filtersEventsService.getFiltersOffEvent().subscribe(() => {
      this.resetFiltersStatus();
      this.selectedMaterials = [];
      this.selectedColors = [];
      this.selectedIsTransparent = [];
    });

    this.isLoading = true;
    this.materialService.getMaterials()
      .subscribe({
        next: (response) => {
          if(response.isSuccessful) {
            this.materials = response.result as MaterialDto[];
            this.sortMaterials();
            this.isLoading = false;
          }
          else {
            this.responseHandler.errorFromServerResponse(response);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.responseHandler.serverNotRespondingError(err);
        }})

    this.isLoading = true;
    this.colorService.getColors()
      .subscribe({
        next: (response) => {
          if(response.isSuccessful) {
            this.colors = response.result as ColorDto[];
            this.sortColors();
            this.isLoading = false;
          }
          else {
            this.responseHandler.errorFromServerResponse(response);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.responseHandler.serverNotRespondingError(err);
        }})
  }

  public checkFilters(): void {
    if(this.isFiltersApplied) {
      let filtersData: FiltersData = {
        selectedMaterials: this.selectedMaterials,
        selectedColors: this.selectedColors,
        selectedIsTransparent: this.selectedIsTransparent.length != 0
      };
      this.filtersEventsService.sendFiltersAppliedEvent(filtersData);
    }
    else {
      this.filtersEventsService.sendFiltersOffEvent();
    }
  }

  public resetFiltersStatus():void{
    if(this.isFiltersApplied) this.isFiltersApplied = false;
  }
  private sortMaterials(): void {
    this.materials = this.materials.sort((m1,m2) => m1.name.localeCompare(m2.name));
  }
  private sortColors(): void {
    this.colors = this.colors.sort((c1,c2) => c1.name.localeCompare(c2.name));
  }

  ngOnDestroy(): void {
    this.filtersOffEventSub.unsubscribe();
  }
}
