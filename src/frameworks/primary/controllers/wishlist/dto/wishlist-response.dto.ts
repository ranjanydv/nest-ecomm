/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ApiProperty } from '@nestjs/swagger';

export class ProductSummaryDto {
  @ApiProperty()
  productId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  shortDescription: string;

  @ApiProperty()
  price: string;

  @ApiProperty()
  salePrice: string;

  constructor(product: any) {
    this.productId = product.productId;
    this.name = product.name;
    this.slug = product.slug;
    this.shortDescription = product.shortDescription;
    this.price = product.price;
    this.salePrice = product.salePrice;
  }
}

export class WishlistItemResponseDto {
  @ApiProperty()
  wishlist_item_id: string;

  @ApiProperty()
  product_id: string;

  @ApiProperty()
  added_at: Date;

  @ApiProperty({ type: ProductSummaryDto, required: false })
  product?: ProductSummaryDto;

  constructor(item: Partial<WishlistItemResponseDto>) {
    Object.assign(this, item);
    if (item.product) {
      this.product = new ProductSummaryDto(item.product);
    }
  }
}

export class WishlistResponseDto {
  @ApiProperty()
  wishlist_id: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty({ type: [WishlistItemResponseDto] })
  items: WishlistItemResponseDto[];

  constructor(wishlist: Partial<WishlistResponseDto>) {
    Object.assign(this, wishlist);
    this.items = (wishlist.items || []).map(
      (item) => new WishlistItemResponseDto(item),
    );
  }
}
