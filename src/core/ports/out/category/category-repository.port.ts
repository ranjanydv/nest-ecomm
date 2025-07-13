import { Category } from 'src/core/domain/category/category.domain';
import { PaginationProps } from 'src/common/types/pagination.types';

export abstract class CategoryRepository {
  abstract findAllCategories(
    options: Partial<Category>[],
    filter: PaginationProps,
  ): Promise<[Category[], number]>;

  abstract findCategory(options: Partial<Category>): Promise<Category>;

  abstract createCategory(data: Category): Promise<Category>;

  abstract createBulkCategory(data: Category[]): Promise<Category[]>;

  abstract updateCategory(
    options: Pick<Category, 'categoryId'>,
    data: Partial<Category>,
  ): Promise<void>;

  abstract saveCategory(data: Category): Promise<Category>;

  abstract countCategories(options: Partial<Category>): Promise<number>;

  abstract categoryExists(options: Partial<Category>[]): Promise<boolean>;

  abstract slugExists(slug: string): Promise<boolean>;
}
