import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { QueryDto } from '../query.dto';
import { ADDRESS_TYPE } from 'src/common/enums/address/address.enum';

export class QueryAddressDto extends QueryDto {
  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  vendorId?: string;

  @ApiProperty({ required: false, enum: ADDRESS_TYPE })
  @IsEnum(ADDRESS_TYPE)
  @IsOptional()
  addressType?: ADDRESS_TYPE;

  @ApiProperty({ required: false })
  @IsOptional()
  search?: string;
}

export class CreateAddressDto {
  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  vendorId?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  addressLine1: string;

  @ApiProperty({ required: false })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  addressLine2?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(50)
  city: string;

  @ApiProperty()
  @IsString()
  @MaxLength(50)
  stateProvince: string;

  @ApiProperty()
  @IsString()
  @MaxLength(20)
  postalCode: string;

  @ApiProperty()
  @IsString()
  @MaxLength(50)
  country: string;

  @ApiProperty({ enum: ADDRESS_TYPE })
  @IsEnum(ADDRESS_TYPE)
  addressType: ADDRESS_TYPE;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}

export class UpdateAddressDto extends PartialType(CreateAddressDto) {}
