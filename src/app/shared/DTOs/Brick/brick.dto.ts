import {ColorDto} from "../Color/color.dto";
import {CloudinaryImage} from "@cloudinary/url-gen";

export interface BrickDto {
  id: string;
  name: string;
  material: string;
  hasImage: boolean;
  imageVersion: number;
  colors: ColorDto[];
  quantity: number;
  img: CloudinaryImage | null;
}
