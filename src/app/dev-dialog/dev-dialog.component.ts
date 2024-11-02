import {AfterViewInit, Component, OnInit} from '@angular/core';
//import { multi } from './data';
import {Color, LegendPosition, ScaleType} from "@swimlane/ngx-charts";
import {Subscription} from "rxjs";
import {LogService} from "../shared/services/tools/log-service";
import {ChartDataModel, HttpRequestMethods, SeriesChildModel} from "./data";
import {DevDialogEventsService} from "../shared/services/events/dev-dialog-events-service";
import {MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {BtnImagesUrls} from "../shared/data/btn-images-urls";
import {CategoryDto} from "../shared/DTOs/Category/category.dto";
import { HttpErrorResponse } from "@angular/common/http";
import {CategoryService} from "../shared/services/api/category-service";
import {ResponseHandler} from "../shared/services/tools/response-handler";

enum Mode {
  MONITOR, BENCHMARK
}
@Component({
  selector: 'app-dev-dialog',
  templateUrl: './dev-dialog.component.html',
  styleUrls: ['./dev-dialog.component.scss']
})
export class DevDialogComponent implements OnInit{
  protected readonly Mode = Mode;
  mode: Mode = Mode.MONITOR;
  monitorData: ChartDataModel = {
    data: [
      {
        name: HttpRequestMethods.GET,
        series: []
      },
      {
        name: HttpRequestMethods.POST,
        series: []
      },
      {
        name: HttpRequestMethods.PUT,
        series: []
      },
      {
        name: HttpRequestMethods.DELETE,
        series: []
      }
    ]
  };
  benchmarkData: ChartDataModel = {
    data: [
      {
        name: HttpRequestMethods.GET,
        series: [
          {
            name: 0,
            value: 0,
            method: '',
            extra: {
              requestUrl: '',
              responseUrl: '',
              params: ''
            }
          },
        ]
      },
    ]
  };
  isRunning: boolean = false;
  benchmarkResult: string = '';
  public callsQuantity: number = 1000;
  public categories: CategoryDto[] = [];
  public selectedCategory: number = 4;

  view: [number, number] = [700, 300];

  // options
  animations: boolean = true;
  legend: boolean = true;
  legendPosition: LegendPosition = LegendPosition.Below;
  legendTitle: string = "HTTP Request Methods";
  xAxis: boolean = false;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = false;
  yAxisLabel: string = 'Response time';
  timeline: boolean = false;
  maxPoints: number = 10;
  benchmarkSum: number = 0;

  private logServiceSub: Subscription = new Subscription();

  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#61affe', '#49cc90', '#fca130', '#f93e3e']
  };

  constructor(
    private logService: LogService,
    private categoryService: CategoryService,
    private devDialogEventsService: DevDialogEventsService,
    private dialogRef: MatDialogRef<DevDialogComponent>,
    public httpResponseHandler: ResponseHandler
  ) {
    this.logService.getApiLog().forEach(logItem=>{
      let index:number = Object.keys(HttpRequestMethods).indexOf(logItem.method);
      logItem.name = this.monitorData.data[index].series.length+1;
      this.monitorData.data[index].series.push(logItem);
    })
    Object.assign(this.monitorData);
    Object.assign(this.benchmarkData);
  }

  ngOnInit(): void {
   this.logServiceSub = this.logService.getLastLogItem().subscribe(logItem => {
     let index:number = Object.keys(HttpRequestMethods).indexOf(logItem.method);
     if(this.mode == Mode.MONITOR){
       if(this.monitorData.data[index].series.length<this.maxPoints){
         logItem.name = this.monitorData.data[index].series.length+1;
       }
       else {
         this.monitorData.data[index].series.shift();
         this.monitorData.data[index].series.forEach(item=>{
           item.name--;
         })
         logItem.name = this.maxPoints;
       }
       this.monitorData.data[index].series.push(logItem);
       this.monitorData.data = [...this.monitorData.data];
     }
     else if (this.mode == Mode.BENCHMARK){
       logItem.name = this.benchmarkData.data[index].series.length+1;
       this.benchmarkSum += logItem.value;
       this.benchmarkData.data[index].series.push(logItem);
       this.benchmarkData.data = [...this.benchmarkData.data];
     }
    });

    this.categoryService.getCategories()
      .subscribe({
        next: (response) => {
          if(response.isSuccessful) {
            this.categories = response.result as CategoryDto[];
            this.categories.forEach(c => {
              c.name = c.name.replaceAll("\"","");
            });
            this.sortCategories();
          }
          else this.httpResponseHandler.errorFromServerResponse(response);
        },
        error: (err: HttpErrorResponse) => {
          this.httpResponseHandler.serverNotRespondingError(err);
        }})
  }

  onSelect(event: any) {
    console.log(event);
  }

  closeDialog() {
    this.dialogRef.close();
    this.devDialogEventsService.sendToggleEvent(false);
  }

  modeBtnClick() {
    switch (this.mode){
      case Mode.MONITOR:
        this.mode = Mode.BENCHMARK;
        break;
      case Mode.BENCHMARK:
        this.mode = Mode.MONITOR;
        break;
    }
  }

  public onQuantityChange(): void {
    if(this.callsQuantity < 10) this.callsQuantity = 10;
    this.callsQuantity = Math.floor(this.callsQuantity);
  }

  private sortCategories(): void{
    this.categories = this.categories.sort((c1,c2) => c1.name.localeCompare(c2.name));
  }

  runBenchmark() {
    this.isRunning = true;
    this.benchmarkResult = 'Sending API calls. Please wait...'
    this.benchmarkSum = 0;
    this.benchmarkData.data[0].series = [];
    this.benchmarkData.data = [...this.benchmarkData.data];

    this.logService.runBenchmark(this.callsQuantity, this.selectedCategory).then(result => {
      if (result) this.benchmarkResult =
        (Math.round((this.benchmarkSum/this.callsQuantity + Number.EPSILON) * 10000) / 10000) +
        's is the average of ' + this.callsQuantity + ' calls to /Bricks';
      if(this.selectedCategory) this.benchmarkResult += '/ByCategory/' + this.selectedCategory
      else this.benchmarkResult = 'An error occurred. Please try again later.';
      this.isRunning = false;
    });
  }
}
