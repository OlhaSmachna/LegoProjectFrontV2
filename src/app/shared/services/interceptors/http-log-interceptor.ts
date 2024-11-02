import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, tap} from "rxjs";
import {LogService} from "../tools/log-service";
import {SeriersChildModel} from "../../../dev-dialog/data";

@Injectable()
export class TimeLogInterceptor implements HttpInterceptor {
  private apisToTraceRequestTime: Array<string> = ['http://localhost:52859/lego_project_api'];
  constructor(private logService: LogService) {}

  public intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const startTime: Date = new Date();

    return next.handle(req).pipe(
      tap(response => {
        if (response && response instanceof HttpResponse && response.url) {
          const isUrlIncludedInWhitelist = this.apisToTraceRequestTime.some(
            (current) => response.url!.startsWith(current)
          );
          if (!isUrlIncludedInWhitelist) {
            return response;
          }
          this.logRequestTime(req, response, startTime);
        }
        return response;
      })
    );
  }

  private logRequestTime(
    request: HttpRequest<any>,
    response: HttpResponse<any>,
    startTime: Date
  ): void {
    if (!request || !request.url) {
      return;
    }
    const endTime: Date = new Date();
    const duration: number = (endTime.valueOf() - startTime.valueOf()) / 1000;

    /**
     * If you want you can add a threshold here to only log requests if they are slower than X seconds
     *
     * if (duration < 1) {
     *  return;
     * }
     */

    /**
     * This is just an example, feel free to add/replace any meta information you need
     */

    /*const dataToLog: Record<string, number | string> = {
      duration,
      params: request.params.toString(),
      method: request.method,
      requestUrl: request.url,
      // this is useful in cases of redirects
      responseUrl: response.url!,
    };*/
    //console.log(duration);

    let logItem: SeriersChildModel = {
      value: duration,
      params: request.params.toString(),
      method: request.method,
      name: request.url,
      responseUrl: response.url!
    };
    this.logService.log(logItem);
    //console.log(logItem)
  }
}
