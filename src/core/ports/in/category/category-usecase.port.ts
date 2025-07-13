import { PaginationProps } from 'src/common/types/pagination.types';
import { Category } from '../../../domain/category/category.domain';

export abstract class CategoryUseCase {
  abstract getAllCategories(
    options: Partial<Category>,
    filter: PaginationProps,
  ): Promise<[Category[], number]>;

  abstract getCategoryById(id: Category['categoryId']): Promise<Category>;

  abstract getCategoryBySlug(slug: Category['slug']): Promise<Category>;

  abstract createCategory(data: Category): Promise<Category>;

  abstract createBulkCategory(data: Category[]): Promise<Category[]>;

  abstract updateCategoryById(
    id: Category['categoryId'],
    data: Partial<Category>,
  ): Promise<void>;

  abstract checkCategoryExistsOrFail(
    options: Partial<Category>[],
  ): Promise<boolean | never>;

  abstract countCategories(options?: Partial<Category>): Promise<number>;
}
