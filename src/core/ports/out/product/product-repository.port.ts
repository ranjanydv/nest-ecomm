import { Product } from 'src/core/domain/product/product.domain';
import { PaginationProps } from 'src/common/types/pagination.types';

export abstract class ProductRepository {
  abstract findAllProducts(
    options: Partial<Product>[],
    filter: PaginationProps,
  ): Promise<[Product[], number]>;

  abstract findProduct(options: Partial<Product>): Promise<Product>;

  abstract createProduct(data: Product): Promise<Product>;

  abstract createBulkProduct(data: Product[]): Promise<Product[]>;

  abstract updateProduct(
    options: Pick<Product, 'productId'>,
    data: Partial<Product>,
  ): Promise<void>;

  abstract saveProduct(data: Product): Promise<Product>;

  abstract countProducts(options: Partial<Product>): Promise<number>;

  abstract productExists(options: Partial<Product>[]): Promise<boolean>;

  abstract slugExists(slug: string): Promise<boolean>;

  abstract skuExists(sku: string): Promise<boolean>;
}
