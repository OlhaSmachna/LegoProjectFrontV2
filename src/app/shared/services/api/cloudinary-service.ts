import {Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Observable} from "rxjs";
import {CloudinaryDto} from "../../DTOs/Cloudinary/cloudinary.dto";
import {SignatureDto} from "../../DTOs/Cloudinary/signature.dto";
import {BackendAddress} from "./BackendAddress";
@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private readonly SignatureURL: string = '/Cloudinary';
  constructor(private client: HttpClient,
              private backend: BackendAddress) {
    this.SignatureURL = backend.get() + this.SignatureURL;
  }
  public getSignature(cloudinaryDto: CloudinaryDto): Observable<SignatureDto> {
    return this.client.post<SignatureDto>(this.SignatureURL, cloudinaryDto);
  }
}
