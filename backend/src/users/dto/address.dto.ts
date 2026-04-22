import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class AddressDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên địa chỉ không được để trống' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  phone!: string;

  @IsString()
  @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  fullAddress!: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}