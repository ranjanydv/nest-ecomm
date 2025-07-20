import { BadRequestException, Injectable } from '@nestjs/common';
import { PaginationProps } from 'src/common/types/pagination.types';
import { Product } from 'src/core/domain/product/product.domain';
import { ProductUseCase } from 'src/core/ports/in/product/product-usecase.port';
import { ProductRepository } from 'src/core/ports/out/product/product-repository.port';
import { VendorUseCase } from 'src/core/ports/in/vendor/vendor-usecase.port';
import { generateSlug, generateUniqueSlug } from 'src/utils/util.index';

@Injectable()
export class ProductUseCaseImpl implements ProductUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly vendorUseCase: VendorUseCase,
  ) {}

  async getAllProducts(
    options: Partial<Product>,
    filter: PaginationProps,
  ): Promise<[Product[], number]> {
    return await this.productRepository.findAllProducts([options], filter);
  }

  async getProductById(productId: Product['productId']): Promise<Product> {
    await this.checkProductExistsOrFail([{ productId }]);

    return await this.productRepository.findProduct({ productId });
  }

  async getProductBySlug(slug: Product['slug']): Promise<Product> {
    await this.checkProductExistsOrFail([{ slug }]);

    return await this.productRepository.findProduct({ slug });
  }

  async createProduct(data: Product): Promise<Product> {
    await this.vendorUseCase.checkVendorExistsOrFail([
      { vendorId: data.vendorId },
    ]);

    // Check Sale Price Validation
    if (data.price && data.salePrice && data.price < data.salePrice) {
      throw new BadRequestException('Sale price must be less than price');
    }

    // Generate unique slug if not provided
    if (!data.slug) {
      const baseSlug = generateSlug(data.name);
      data.slug = await generateUniqueSlug(baseSlug, (slug: string) =>
        this.productRepository.slugExists(slug),
      );
    }

    // Check SKU uniqueness if provided
    if (data.sku) {
      const skuExists = await this.productRepository.skuExists(data.sku);
      if (skuExists) {
        throw new BadRequestException('SKU already exists');
      }
    }

    return await this.productRepository.createProduct(data);
  }

  async createBulkProduct(data: Product[]): Promise<Product[]> {
    await this.vendorUseCase.checkVendorExistsOrFail(
      data?.map(({ vendorId }) => ({ vendorId })),
    );

    const productsWithSlugs = await Promise.all(
      data.map(async (product) => {
        if (!product.slug) {
          const baseSlug = generateSlug(product.name);
          product.slug = await generateUniqueSlug(baseSlug, (slug: string) =>
            this.productRepository.slugExists(slug),
          );
        }

        if (product.sku) {
          const skuExists = await this.productRepository.skuExists(product.sku);
          if (skuExists) {
            throw new BadRequestException(`SKU ${product.sku} already exists`);
          }
        }

        return product;
      }),
    );

    return await this.productRepository.createBulkProduct(productsWithSlugs);
  }

  async updateProductById(
    productId: Product['productId'],
    data: Partial<Product>,
  ): Promise<void> {
    const product = await this.getProductById(productId);

    if (data.vendorId) {
      await this.vendorUseCase.checkVendorExistsOrFail([
        { vendorId: data.vendorId },
      ]);
    }

    if (data.sku) {
      const skuExists = await this.productRepository.skuExists(
        data.sku,
        productId,
      );
      if (skuExists) {
        throw new BadRequestException('SKU already exists');
      }
    }

    const price = data.price ?? product.price;
    const salePrice = data.salePrice ?? product.salePrice;

    if (price && salePrice && price < salePrice) {
      throw new BadRequestException('Sale price must be less than price');
    }

    return await this.productRepository.updateProduct({ productId }, data);
  }

  async checkProductExistsOrFail(
    options: Partial<Product>[],
  ): Promise<boolean> {
    if (await this.productRepository.productExists(options)) return true;

    throw new BadRequestException('Product does not exist');
  }

  async countProducts(options?: Partial<Product>): Promise<number> {
    return await this.productRepository.countProducts(options);
  }
}
