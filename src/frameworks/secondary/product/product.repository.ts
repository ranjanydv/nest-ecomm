import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { ProductEntity } from './product.entity';
import { PaginationProps } from 'src/common/types/pagination.types';
import { Product } from 'src/core/domain/product/product.domain';
import { ProductRepository } from 'src/core/ports/out/product/product-repository.port';
import { getPaginationSortParams } from 'src/utils/util.index';

@Injectable()
export class ProductRepositoryImpl implements ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async findAllProducts(
    options: Partial<Product>[],
    filter: PaginationProps,
  ): Promise<[Product[], number]> {
    const baseCondition = (options: Partial<Product>) => [
      { name: ILike(`%${filter?.search || ''}%`), ...options },
      { slug: ILike(`%${filter?.search || ''}%`), ...options },
      { sku: ILike(`%${filter?.search || ''}%`), ...options },
    ];

    const condition: FindOptionsWhere<Product>[] = options?.flatMap((opt) =>
      baseCondition(opt),
    );

    const products = await this.productRepository.find({
      where: condition,
      relations: {
        vendor: true,
      },
      ...getPaginationSortParams(filter),
    });

    const count = await this.productRepository.count({ where: condition });

    return [Product.toDomains(products), count] as [Product[], number];
  }

  async findProduct(options: Partial<Product>): Promise<Product> {
    return Product.toDomain(
      await this.productRepository.findOneOrFail({
        where: options,
        relations: {
          vendor: true,
        },
      }),
    );
  }

  async createProduct(data: Product): Promise<Product> {
    return Product.toDomain(
      await this.productRepository.save(this.productRepository.create(data)),
    );
  }

  async createBulkProduct(data: Product[]): Promise<Product[]> {
    return Product.toDomains(
      await this.productRepository.save(this.productRepository.create(data)),
    );
  }

  async updateProduct(
    options: Pick<Product, 'productId'>,
    data: Partial<Product>,
  ): Promise<void> {
    await this.productRepository.update(options, data);
  }

  async saveProduct(data: Product): Promise<Product> {
    return Product.toDomain(await this.productRepository.save(data));
  }

  async productExists(options: Partial<Product>[]): Promise<boolean> {
    return await this.productRepository.existsBy(options);
  }

  async countProducts(options: Partial<Product>): Promise<number> {
    return await this.productRepository.countBy(options);
  }

  async slugExists(slug: string): Promise<boolean> {
    return await this.productRepository.existsBy({ slug });
  }

  async skuExists(sku: string, productId?: string): Promise<boolean> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .where('product.sku = :sku', { sku });

    if (productId) {
      query.andWhere('product.productId != :productId', { productId });
    }

    return (await query.getCount()) > 0;
  }
}
