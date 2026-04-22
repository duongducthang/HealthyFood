import { IsOptional, IsString, MinLength } from "class-validator";

export class FoodDetailDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsOptional()
  @IsString()
  serving?: string;

  @IsOptional()
  calories?: string | number;
}

