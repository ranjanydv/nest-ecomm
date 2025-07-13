import { z } from 'zod';
import { plainToInstance } from 'class-transformer';
import { CreateProductProps, UpdateProductProps } from './product.types';
import { PRODUCT_STATUS } from 'src/common/enums/product/product.enum';

export class Product {
  productId: string;
  vendorId: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  salePrice: number;
  currency: string;
  sku: string;
  status: PRODUCT_STATUS;
  weight: number;
  weightUnit: string;
  dimensions: string;
  taxClassId: string;
  isFeatured: boolean;
  totalSalesCount: number;
  createdAt: Date;
  updatedAt: Date;

  static readonly #validator = z.object({
    vendorId: z.string().uuid(),
    name: z.string().min(1).max(255),
    slug: z
      .string()
      .min(1)
      .max(255)
      .regex(/^[a-z0-9-]+$/)
      .nullish(),
    description: z.string().min(1),
    shortDescription: z.string().max(500).nullish(),
    price: z.number().positive(),
    salePrice: z.number().positive().nullish(),
    currency: z.string().max(10).default('USD'),
    sku: z.string().max(50).nullish(),
    status: z.nativeEnum(PRODUCT_STATUS).default(PRODUCT_STATUS.DRAFT),
    weight: z.number().positive().nullish(),
    weightUnit: z.string().max(10).nullish(),
    dimensions: z.string().max(50).nullish(),
    taxClassId: z.string().uuid().nullish(),
    isFeatured: z.boolean().default(false),
    totalSalesCount: z.number().int().min(0).default(0),
  });

  static create(createProductProps: CreateProductProps) {
    return plainToInstance(Product, this.#validator.parse(createProductProps), {
      exposeUnsetFields: false,
    });
  }

  static update(updateProductProps: UpdateProductProps) {
    return plainToInstance(
      Product,
      this.#validator.partial().parse(updateProductProps),
      { exposeUnsetFields: false },
    );
  }

  static toDomain(product: Product) {
    return plainToInstance(Product, product, {
      exposeUnsetFields: false,
      enableImplicitConversion: true,
    });
  }

  static toDomains(products: Product[]) {
    return products?.map(this.toDomain);
  }
}
