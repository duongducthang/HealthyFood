import { IsEmail, IsOptional, IsString, Matches } from "class-validator";

export class UpdateMeDto {
  @IsEmail()
  @IsOptional()
  email?: string;
  
  @IsOptional()
  @IsString()
  userName?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  birthday?: Date;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  age?: number;

}

