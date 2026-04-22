import { Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString, MinLength, ValidateNested } from "class-validator";
import { FoodDetailDto } from "./food-detail.dto";

export class UpdateFoodDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  category?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @IsOptional()
  @IsString()
  desc?: string;

  @IsOptional()
  @IsString()
  fullDesc?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsNumber()
  kcal?: number;


  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FoodDetailDto)
  details?: FoodDetailDto[];
}

