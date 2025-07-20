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

@ApiBearerAuth()
@ApiTags('Wishlist')
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistUseCase: WishlistUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Get current user wishlist' })
  @ApiResponse({ status: 200, description: 'Wishlist fetched' })
  getWishlist(@AuthUser() user: User) {
    return this.wishlistUseCase.getWishlistByUserId(user.userId);
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
