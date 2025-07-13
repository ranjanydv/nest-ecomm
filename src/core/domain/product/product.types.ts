import { PRODUCT_STATUS } from 'src/common/enums/product/product.enum';

export type CreateProductProps = {
  vendorId: string;
  name: string;
  slug?: string;
  description: string;
  shortDescription?: string;
  price: number;
  salePrice?: number;
  currency?: string;
  sku?: string;
  status?: PRODUCT_STATUS;
  weight?: number;
  weightUnit?: string;
  dimensions?: string;
  taxClassId?: string;
  isFeatured?: boolean;
  totalSalesCount?: number;
};

export type UpdateProductProps = Partial<CreateProductProps>;
