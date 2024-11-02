import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {BrickDto} from "../../DTOs/Brick/brick.dto";
@Injectable({
  providedIn: 'root'
})
export class BricksEventsService {
  private updatedBrick: Subject<BrickDto> = new Subject<BrickDto>();
  private deletedBrickId: Subject<string> = new Subject<string>();

  public sendBrickUpdatedEvent(updatedBrick: BrickDto) {
    this.updatedBrick.next(updatedBrick);
  }
  public getBrickUpdatedEvent(): Observable<BrickDto> {
    return this.updatedBrick.asObservable();
  }

  public sendBrickDeletedEvent(deletedBrickID: string) {
    this.deletedBrickId.next(deletedBrickID);
  }
  public getBrickDeletedEvent(): Observable<string>{
    return this.deletedBrickId.asObservable();
  }
}
