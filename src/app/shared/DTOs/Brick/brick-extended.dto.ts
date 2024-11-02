import {ColorDto} from "../Color/color.dto";
import {MaterialDto} from "../Material/material.dto";
import {CategoryDto} from "../Category/category.dto";
import {CloudinaryImage} from "@cloudinary/url-gen";

export interface BrickExtendedDto {
  id: string;
  name: string;
  hasImage: boolean;
  materialID: number;
  categoryID: number;
  colorIDs: number[];
}
