import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";
import {SeriesChildModel} from "../../../dev-dialog/data";
import {BricksService} from "../api/brick-service";
@Injectable({
  providedIn: 'root'
})
export class LogService {
  //private apiLog: Subject<SeriesChildModel[]> = new Subject<SeriesChildModel[]>();
  private lastLogItem: Subject<SeriesChildModel> = new Subject<SeriesChildModel>();
  private logItems: SeriesChildModel[] = [];

  constructor(private brickService: BricksService) {}
  public log(item: SeriesChildModel) {
    this.logItems.push(item);
    //this.apiLog.next(this.logItems);
    this.lastLogItem.next(item);
  }
  public getApiLog(): SeriesChildModel[] {
    return this.logItems;
  }

  public getLastLogItem(): Observable<SeriesChildModel> {
    return this.lastLogItem.asObservable();
  }

  async runBenchmark(num: number, catId: number) {
    let isSuccessful = true;
    for (let i = 0; i < num; i++) {
      isSuccessful = await new Promise(resolve => {
        this.brickService.getBricksAllOrByCategory(catId)
          .subscribe({
            next: (response)=>{
              if (response.isSuccessful) resolve(true);
              else resolve(false);
            }
          })
      });
      if(!isSuccessful)break;
    }
    return isSuccessful;
  }

}
