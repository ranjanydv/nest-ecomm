import { ApiProperty } from '@nestjs/swagger';
import { CATEGORY_STATUS } from 'src/common/enums/category/category.enum';

class CategoryParentDto {
  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  constructor({ categoryId, name, slug }: CategoryParentDto) {
    Object.assign(this, { categoryId, name, slug });
  }
}

class CategorySubDto {
  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  constructor({ categoryId, name, slug }: CategorySubDto) {
    Object.assign(this, { categoryId, name, slug });
  }
}

export class CategoryResponseDto {
  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  parentCategoryId: string;

  @ApiProperty({ type: CategoryParentDto, required: false })
  parentCategory?: CategoryParentDto;

  @ApiProperty({ type: [CategorySubDto], required: false })
  subCategories?: CategorySubDto[];

  @ApiProperty()
  iconUrl: string;

  @ApiProperty({ enum: CATEGORY_STATUS })
  status: CATEGORY_STATUS;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor({
    categoryId,
    name,
    slug,
    description,
    parentCategoryId,
    parentCategory,
    subCategories,
    iconUrl,
    status,
    createdAt,
    updatedAt,
  }: CategoryResponseDto) {
    Object.assign(this, {
      categoryId,
      name,
      slug,
      description,
      parentCategoryId,
      iconUrl,
      status,
      createdAt,
      updatedAt,
    });

    this.parentCategory = parentCategory
      ? new CategoryParentDto(parentCategory)
      : undefined;
    this.subCategories = subCategories?.map((sub) => new CategorySubDto(sub));
  }
}
