import {ColorDto} from "../Color/color.dto";
import {CloudinaryImage} from "@cloudinary/url-gen";

export interface CloudinaryDto {
  public_id: string;
  folder: string;
  upload_preset: string;
}
