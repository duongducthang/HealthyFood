import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from "class-validator";
import { FoodDetailDto } from "./food-detail.dto";

export class CreateFoodDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber()
  @IsOptional()
  kcal?: number;

  @IsString()
  @IsOptional()
  @MinLength(1)
  desc?: string;

  @IsString()
  @IsOptional()
  fullDesc?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FoodDetailDto)
  details?: FoodDetailDto[];
}