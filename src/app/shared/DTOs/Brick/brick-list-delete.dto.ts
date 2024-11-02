import {ColorDto} from "../Color/color.dto";
import {MaterialDto} from "../Material/material.dto";
import {CategoryDto} from "../Category/category.dto";
import {CloudinaryImage} from "@cloudinary/url-gen";

export interface BrickListDeleteDto {
  brickId: string;
  colorId: number;
}
