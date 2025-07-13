import { z } from 'zod';
import { plainToInstance } from 'class-transformer';
import { CreateCategoryProps, UpdateCategoryProps } from './category.types';
import { CATEGORY_STATUS } from 'src/common/enums/category/category.enum';

export class Category {
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  parentCategoryId: string;
  iconUrl: string;
  status: CATEGORY_STATUS;
  createdAt: Date;
  updatedAt: Date;

  static readonly #validator = z.object({
    name: z.string().min(1).max(100),
    slug: z
      .string()
      .min(1)
      .max(100)
      .regex(/^[a-z0-9-]+$/)
      .nullish(),
    description: z.string().max(1000).nullish(),
    parentCategoryId: z.string().uuid().nullish(),
    iconUrl: z.string().url().max(255).nullish(),
    status: z.nativeEnum(CATEGORY_STATUS).default(CATEGORY_STATUS.ACTIVE),
  });

  static create(createCategoryProps: CreateCategoryProps) {
    return plainToInstance(
      Category,
      this.#validator.parse(createCategoryProps),
      {
        exposeUnsetFields: false,
      },
    );
  }

  static update(updateCategoryProps: UpdateCategoryProps) {
    return plainToInstance(
      Category,
      this.#validator.partial().parse(updateCategoryProps),
      { exposeUnsetFields: false },
    );
  }

  static toDomain(category: Category) {
    return plainToInstance(Category, category, {
      exposeUnsetFields: false,
      enableImplicitConversion: true,
    });
  }

  static toDomains(categories: Category[]) {
    return categories?.map(this.toDomain);
  }
}
