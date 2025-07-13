import { PaginationProps } from 'src/common/types/pagination.types';
import { Product } from '../../../domain/product/product.domain';

export abstract class ProductUseCase {
  abstract getAllProducts(
    options: Partial<Product>,
    filter: PaginationProps,
  ): Promise<[Product[], number]>;

  abstract getProductById(id: Product['productId']): Promise<Product>;

  abstract getProductBySlug(slug: Product['slug']): Promise<Product>;

  abstract createProduct(data: Product): Promise<Product>;

  abstract createBulkProduct(data: Product[]): Promise<Product[]>;

  abstract updateProductById(
    id: Product['productId'],
    data: Partial<Product>,
  ): Promise<void>;

  abstract checkProductExistsOrFail(
    options: Partial<Product>[],
  ): Promise<boolean | never>;

  abstract countProducts(options?: Partial<Product>): Promise<number>;
}
