import { Type } from "class-transformer";
import { IsInt, IsNumber, IsOptional, IsString, Matches, Min, MinLength } from "class-validator";

export class CreateCalorieLogDto {
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date!: string;

  @IsString()
  @MinLength(1)
  food!: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  qty?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  kcal?: number;
}

