import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {MaterialDto} from "../../DTOs/Material/material.dto";
import {ColorDto} from "../../DTOs/Color/color.dto";

export interface FiltersData{
  selectedMaterials: MaterialDto[];
  selectedColors: ColorDto[];
  selectedIsTransparent: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FiltersEventsService {
  private selectedFilters: Subject<FiltersData> = new Subject<FiltersData>();
  private filtersOff: Subject<boolean> = new Subject<boolean>();

  public sendFiltersAppliedEvent(filters: FiltersData) {
    this.selectedFilters.next(filters);
  }
  public getFiltersAppliedEvent(): Observable<FiltersData>{
    return this.selectedFilters.asObservable();
  }

  public sendFiltersOffEvent() {
    this.filtersOff.next(true);
  }
  public getFiltersOffEvent(): Observable<any>{
    return this.filtersOff.asObservable();
  }
}
