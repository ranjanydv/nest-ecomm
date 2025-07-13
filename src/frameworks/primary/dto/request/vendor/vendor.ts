import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  Matches,
  IsUrl,
  IsDate,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { QueryDto } from '../query.dto';
import { VENDOR_STATUS } from '../../../../../common/enums/vendor/vendor.enum';

export class QueryVendorDto extends QueryDto {
  @ApiProperty({ required: false })
  @Transform(({ value }) => (value === '' ? undefined : Number(value)))
  @IsOptional()
  roleId?: number;

  @ApiProperty({ required: false })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  roleName?: string;

  @ApiProperty({ required: false, enum: VENDOR_STATUS })
  @IsEnum(VENDOR_STATUS)
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  vendorStatus?: VENDOR_STATUS;

  @ApiProperty({ required: false })
  @IsOptional()
  search?: string;
}

export class CreateVendorDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  storeName: string;

  @ApiProperty({ required: false })
  @IsString()
  @MaxLength(1000)
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsUrl()
  @MaxLength(255)
  @IsOptional()
  logoUrl?: string;

  @ApiProperty({ required: false })
  @IsUrl()
  @MaxLength(255)
  @IsOptional()
  bannerUrl?: string;

  @ApiProperty({ required: false })
  @IsUrl()
  @MaxLength(255)
  @IsOptional()
  websiteUrl?: string;

  @ApiProperty({ required: false })
  @IsString()
  @MaxLength(20)
  @IsPhoneNumber('NP')
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiProperty({ required: false })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  establishedDate?: Date;

  @ApiProperty({ enum: VENDOR_STATUS, default: VENDOR_STATUS.PENDING_APPROVAL })
  @IsEnum(VENDOR_STATUS)
  @IsOptional()
  status?: VENDOR_STATUS = VENDOR_STATUS.PENDING_APPROVAL;
}

export class UpdateVendorDto extends PartialType(CreateVendorDto) {}
