import {Injectable} from '@angular/core';
import {Cloudinary, CloudinaryImage} from "@cloudinary/url-gen";
import {scale} from "@cloudinary/url-gen/actions/resize";
import {CloudinaryDto} from "../../DTOs/Cloudinary/cloudinary.dto";
import {CloudinaryService} from "../api/cloudinary-service";
import { HttpErrorResponse } from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class CloudService {
  public readonly USE_CLOUD: boolean = true;
  private readonly CLOUD_NAME: string = process.env['NG_APP_CLOUD_NAME'] ?? '';
  private readonly CLOUD_FOLDER: string = process.env['NG_APP_CLOUD_FOLDER'] ?? '';
  private readonly CLOUD_KEY: string = process.env['NG_APP_CLOUD_KEY'] ?? '';
  private readonly UPLOAD_PRESET: string = process.env['NG_APP_UPLOAD_PRESET'] ?? '';
  public CLOUD!: Cloudinary;
  constructor(
    private cloudinaryService: CloudinaryService
  ) {
    if(this.USE_CLOUD)
      this.CLOUD = new Cloudinary({cloud: {cloudName: this.CLOUD_NAME}});
  }
  public getImage(name: string, size: number): CloudinaryImage {
    return this.CLOUD.image(this.CLOUD_FOLDER + name).resize(scale().width(size));
  }
  public getImageWithVersion(name: string, version: number, size: number): CloudinaryImage {
    return this.CLOUD.image('v' + version + '/' + this.CLOUD_FOLDER + name).resize(scale().width(size));
  }
  public uploadImage(file: File, id: string): Promise<string> {
    return new Promise((resolve, reject) => {
      let url = `https://api.cloudinary.com/v1_1/${this.CLOUD_NAME}/upload`;
      let xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

      let fd = new FormData();
      fd.append("file", file);
      fd.append('api_key', this.CLOUD_KEY);
      fd.append("public_id", id);
      fd.append("folder", this.CLOUD_FOLDER);
      fd.append('upload_preset', this.UPLOAD_PRESET);

      let cloudinaryDto: CloudinaryDto = {
        public_id: id,
        folder: this.CLOUD_FOLDER,
        upload_preset: this.UPLOAD_PRESET
      }

      xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          resolve(xhr.responseText);
        } else {
          reject({
            status: this.status,
            statusText: xhr.statusText
          });
        }
      };
      xhr.onerror = function () {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      };

      this.cloudinaryService.getSignature(cloudinaryDto)
        .subscribe({
          next: (response) => {
            fd.append('timestamp', response.timestamp);
            fd.append('signature', response.signature);
            xhr.send(fd);
          },
          error: (err: HttpErrorResponse) => {
            console.log(err.message)
          }})
    });
  }
}
