export enum HttpRequestMethods{
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE"
}
export class ChartDataModel {
  public data: SeriesModel[];
  constructor(data:  SeriesModel[]) {
    this.data = data;
  }
}
export class SeriesModel {
  public name: HttpRequestMethods;
  public series: SeriesChildModel[];
  constructor(name:  HttpRequestMethods, series: SeriesChildModel[]) {
    this.name = name;
    this.series = series;
  }
}
export class SeriesChildModel {
  public method: string;

  public value: number;
  public name: number;

  public extra:{
    requestUrl: string;
    responseUrl: string;
    params: string;
  }

  constructor(responseTime: number, params: string, method: string, requestUrl: string, responseUrl: string) {
    this.method = method;
    this.value = responseTime;

    this.extra.requestUrl = requestUrl;
    this.extra.responseUrl = responseUrl;
    this.extra.params = params;
  }
}
