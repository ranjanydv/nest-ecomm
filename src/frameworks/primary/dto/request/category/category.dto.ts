/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { QueryDto } from '../query.dto';
import { CATEGORY_STATUS } from 'src/common/enums/category/category.enum';

export class QueryCategoryDto extends QueryDto {
  @ApiProperty({ required: false })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  parentCategoryId?: string;

  @ApiProperty({ required: false, enum: CATEGORY_STATUS })
  @IsEnum(CATEGORY_STATUS)
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  status?: CATEGORY_STATUS;

  @ApiProperty({ required: false })
  @IsOptional()
  search?: string;
}

export class CreateCategoryDto {
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

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  parentCategoryId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  iconUrl?: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiProperty({ required: false, enum: CATEGORY_STATUS })
  @IsEnum(CATEGORY_STATUS)
  @IsOptional()
  status?: CATEGORY_STATUS;
}
