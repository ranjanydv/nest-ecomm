import { ApiProperty } from '@nestjs/swagger';
import { PRODUCT_STATUS } from 'src/common/enums/product/product.enum';

class ProductVendorDto {
  @ApiProperty()
  vendorId: string;

  @ApiProperty()
  storeName: string;

  @ApiProperty()
  slug: string;

  constructor({ vendorId, storeName, slug }: ProductVendorDto) {
    Object.assign(this, { vendorId, storeName, slug });
  }
}

export class ProductResponseDto {
  @ApiProperty()
  productId: string;

  @ApiProperty()
  vendorId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  shortDescription: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  salePrice: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  sku: string;

  @ApiProperty({ enum: PRODUCT_STATUS })
  status: PRODUCT_STATUS;

  @ApiProperty()
  weight: number;

  @ApiProperty()
  weightUnit: string;

  @ApiProperty()
  dimensions: string;

  @ApiProperty()
  taxClassId: string;

  @ApiProperty()
  isFeatured: boolean;

  @ApiProperty()
  totalSalesCount: number;

  @ApiProperty({ type: ProductVendorDto, required: false })
  vendor?: ProductVendorDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor({
    productId,
    vendorId,
    name,
    slug,
    description,
    shortDescription,
    price,
    salePrice,
    currency,
    sku,
    status,
    weight,
    weightUnit,
    dimensions,
    taxClassId,
    isFeatured,
    totalSalesCount,
    vendor,
    createdAt,
    updatedAt,
  }: ProductResponseDto) {
    Object.assign(this, {
      productId,
      vendorId,
      name,
      slug,
      description,
      shortDescription,
      price,
      salePrice,
      currency,
      sku,
      status,
      weight,
      weightUnit,
      dimensions,
      taxClassId,
      isFeatured,
      totalSalesCount,
      createdAt,
      updatedAt,
    });

    this.vendor = vendor ? new ProductVendorDto(vendor) : undefined;
  }
}
