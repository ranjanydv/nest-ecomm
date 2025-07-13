import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { PaginationProps } from 'src/common/types/pagination.types';
import { Category } from 'src/core/domain/category/category.domain';
import { CategoryRepository } from 'src/core/ports/out/category/category-repository.port';
import { getPaginationSortParams } from 'src/utils/util.index';

@Injectable()
export class CategoryRepositoryImpl implements CategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async findAllCategories(
    options: Partial<Category>[],
    filter: PaginationProps,
  ): Promise<[Category[], number]> {
    const baseCondition = (options: Partial<Category>) => [
      { name: ILike(`%${filter?.search || ''}%`), ...options },
      { slug: ILike(`%${filter?.search || ''}%`), ...options },
    ];

    const condition: FindOptionsWhere<Category>[] = options?.flatMap((opt) =>
      baseCondition(opt),
    );

    const categories = await this.categoryRepository.find({
      where: condition,
      relations: {
        parentCategory: true,
        subCategories: true,
      },
      ...getPaginationSortParams(filter),
    });

    const count = await this.categoryRepository.count({ where: condition });

    return [Category.toDomains(categories), count] as [Category[], number];
  }

  async findCategory(options: Partial<Category>): Promise<Category> {
    return Category.toDomain(
      await this.categoryRepository.findOneOrFail({
        where: options,
        relations: {
          parentCategory: true,
          subCategories: true,
        },
      }),
    );
  }

  async createCategory(data: Category): Promise<Category> {
    return Category.toDomain(
      await this.categoryRepository.save(this.categoryRepository.create(data)),
    );
  }

  async createBulkCategory(data: Category[]): Promise<Category[]> {
    return Category.toDomains(
      await this.categoryRepository.save(this.categoryRepository.create(data)),
    );
  }

  async updateCategory(
    options: Pick<Category, 'categoryId'>,
    data: Partial<Category>,
  ): Promise<void> {
    await this.categoryRepository.update(options, data);
  }

  async saveCategory(data: Category): Promise<Category> {
    return Category.toDomain(await this.categoryRepository.save(data));
  }

  async categoryExists(options: Partial<Category>[]): Promise<boolean> {
    return await this.categoryRepository.existsBy(options);
  }

  async countCategories(options: Partial<Category>): Promise<number> {
    return await this.categoryRepository.countBy(options);
  }

  async slugExists(slug: string): Promise<boolean> {
    return await this.categoryRepository.existsBy({ slug });
  }
}
