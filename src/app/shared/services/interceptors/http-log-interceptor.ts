import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, tap} from "rxjs";
import {LogService} from "../tools/log-service";
import {SeriesChildModel} from "../../../dev-dialog/data";
import {BackendAddress} from "../api/BackendAddress";

@Injectable()
export class HttpLogInterceptor implements HttpInterceptor {
  private apisToTraceRequestTime: Array<string> = [];
  constructor(private logService: LogService, private backend: BackendAddress) {
    this.apisToTraceRequestTime.push(backend.get())
  }

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

    let logItem: SeriesChildModel = {
      method: request.method,
      value: duration,
      name: 0,
      extra: {
        requestUrl: request.url,
        responseUrl: response.url!,
        params: request.params.toString()
      }
    };
    this.logService.log(logItem);
  }
}
