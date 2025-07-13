import { BadRequestException, Injectable } from '@nestjs/common';
import { PaginationProps } from 'src/common/types/pagination.types';
import { Category } from 'src/core/domain/category/category.domain';
import { CategoryUseCase } from 'src/core/ports/in/category/category-usecase.port';
import { CategoryRepository } from 'src/core/ports/out/category/category-repository.port';
import { generateSlug, generateUniqueSlug } from 'src/utils/util.index';

@Injectable()
export class CategoryUseCaseImpl implements CategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async getAllCategories(
    options: Partial<Category>,
    filter: PaginationProps,
  ): Promise<[Category[], number]> {
    return await this.categoryRepository.findAllCategories([options], filter);
  }

  async getCategoryById(categoryId: Category['categoryId']): Promise<Category> {
    await this.checkCategoryExistsOrFail([{ categoryId }]);

    return await this.categoryRepository.findCategory({ categoryId });
  }

  async getCategoryBySlug(slug: Category['slug']): Promise<Category> {
    await this.checkCategoryExistsOrFail([{ slug }]);

    return await this.categoryRepository.findCategory({ slug });
  }

  async createCategory(data: Category): Promise<Category> {
    // Generate unique slug if not provided
    if (!data.slug) {
      const baseSlug = generateSlug(data.name);
      data.slug = await generateUniqueSlug(baseSlug, (slug: string) =>
        this.categoryRepository.slugExists(slug),
      );
    }

    return await this.categoryRepository.createCategory(data);
  }

  async createBulkCategory(data: Category[]): Promise<Category[]> {
    const categoriesWithSlugs = await Promise.all(
      data.map(async (category) => {
        if (!category.slug) {
          const baseSlug = generateSlug(category.name);
          category.slug = await generateUniqueSlug(baseSlug, (slug: string) =>
            this.categoryRepository.slugExists(slug),
          );
        }
        return category;
      }),
    );

    return await this.categoryRepository.createBulkCategory(
      categoriesWithSlugs,
    );
  }

  async updateCategoryById(
    categoryId: Category['categoryId'],
    data: Partial<Category>,
  ): Promise<void> {
    await this.checkCategoryExistsOrFail([{ categoryId }]);

    return await this.categoryRepository.updateCategory({ categoryId }, data);
  }

  async checkCategoryExistsOrFail(
    options: Partial<Category>[],
  ): Promise<boolean> {
    if (await this.categoryRepository.categoryExists(options)) return true;

    throw new BadRequestException('Category does not exist');
  }

  async countCategories(options?: Partial<Category>): Promise<number> {
    return await this.categoryRepository.countCategories(options);
  }
}
