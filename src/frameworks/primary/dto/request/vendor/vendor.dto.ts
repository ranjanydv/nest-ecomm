import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { QueryDto } from '../query.dto';
import { VENDOR_STATUS } from 'src/common/enums/vendor/vendor.enum';

export class QueryVendorDto extends QueryDto {
  @ApiProperty({ required: false })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  userId?: string;

  @ApiProperty({ required: false, enum: VENDOR_STATUS })
  @IsEnum(VENDOR_STATUS)
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  status?: VENDOR_STATUS;

  @ApiProperty({ required: false })
  @IsOptional()
  search?: string;
}

export class CreateVendorDto {
  @ApiProperty()
  @IsUUID()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  storeName: string;

  @ApiProperty()
  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  bannerUrl?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  websiteUrl?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  establishedDate?: string;
}

export class UpdateVendorDto extends PartialType(CreateVendorDto) {
  @ApiProperty({ required: false, enum: VENDOR_STATUS })
  @IsEnum(VENDOR_STATUS)
  @IsOptional()
  status?: VENDOR_STATUS;
}
