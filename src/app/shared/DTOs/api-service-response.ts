export interface ApiServiceResponse {
  isSuccessful:boolean;
  errorMessage:string;
  stackTrace:string;
  resultMessage:string;
  result:any;
}
