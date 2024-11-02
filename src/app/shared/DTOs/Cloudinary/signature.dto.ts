import {ColorDto} from "../Color/color.dto";
import {CloudinaryImage} from "@cloudinary/url-gen";

export interface SignatureDto {
  signature: string;
  timestamp: string;
}
