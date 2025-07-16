/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { QueryDto } from '../query.dto';
import { PRODUCT_STATUS } from 'src/common/enums/product/product.enum';

export class QueryProductDto extends QueryDto {
  @ApiProperty({ required: false })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  vendorId?: string;

  @ApiProperty({ required: false, enum: PRODUCT_STATUS })
  @IsEnum(PRODUCT_STATUS)
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  status?: PRODUCT_STATUS;

  @ApiProperty({ required: false })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  isFeatured?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  search?: string;
}

export class CreateProductDto {
  @ApiProperty()
  @IsUUID()
  vendorId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug?: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  shortDescription?: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  salePrice?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  weight?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  weightUnit?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  dimensions?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  taxClassId?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({ required: false, enum: PRODUCT_STATUS })
  @IsEnum(PRODUCT_STATUS)
  @IsOptional()
  status?: PRODUCT_STATUS;
}
