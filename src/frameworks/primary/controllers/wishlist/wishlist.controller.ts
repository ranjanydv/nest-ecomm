/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { WishlistUseCase } from 'src/core/ports/in/wishlist/wishlist-usecase.port';
import { CreateWishlistItemDto } from './dto/create-wishlist-item.dto';
import { User } from 'src/core/domain/user/user.domain';
import { AuthUser } from '../../decorators/user.decorator';
import { WishlistResponseDto } from './dto/wishlist-response.dto';
import { ProductUseCase } from 'src/core/ports/in/product/product-usecase.port';

@ApiBearerAuth()
@ApiTags('Wishlist')
@Controller('wishlist')
export class WishlistController {
  constructor(
    private readonly wishlistUseCase: WishlistUseCase,
    private readonly productUseCase: ProductUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get current user wishlist' })
  @ApiResponse({
    status: 200,
    description: 'Wishlist fetched',
    type: WishlistResponseDto,
  })
  async getWishlist(@AuthUser() user: User): Promise<WishlistResponseDto> {
    const wishlist = await this.wishlistUseCase.getWishlistByUserId(
      user.userId,
    );
    // Enrich items with product details
    const items = await Promise.all(
      (wishlist.items || []).map(async (item) => {
        let product = null;
        try {
          product = await this.productUseCase.getProductById(item.product_id);
        } catch {
          // If product not found or unavailable, omit the product field
          return { ...item };
        }
        return { ...item, product };
      }),
    );
    return new WishlistResponseDto({ ...wishlist, items });
  }

  @Post('items')
  @ApiOperation({ summary: 'Add item to wishlist' })
  @ApiBody({ type: CreateWishlistItemDto })
  async addItem(@AuthUser() user: User, @Body() dto: CreateWishlistItemDto) {
    const wishlist = await this.wishlistUseCase.getWishlistByUserId(
      user.userId,
    );

    return this.wishlistUseCase.addItem(wishlist.wishlist_id, dto.productId);
  }

  @Delete('items/:wishlistItemId')
  @ApiOperation({ summary: 'Remove item from wishlist' })
  removeItem(@Param('wishlistItemId') wishlistItemId: string) {
    return this.wishlistUseCase.removeItem(wishlistItemId);
  }

  @Delete('items')
  @ApiOperation({ summary: 'Clear all items from wishlist' })
  clearWishlist(@AuthUser() user: User) {
    return this.wishlistUseCase.clearWishlistByUserId(user.userId);
  }
}
