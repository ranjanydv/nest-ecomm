import { Injectable, NotFoundException } from '@nestjs/common';
import { WishlistUseCase } from 'src/core/ports/in/wishlist/wishlist-usecase.port';
import { WishlistRepository } from 'src/core/ports/out/wishlist/wishlist-repository.port';
import { WishlistEntity } from 'src/frameworks/secondary/wishlist/wishlist.entity';
import { WishlistItemEntity } from 'src/frameworks/secondary/wishlist/wishlist-item.entity';

@Injectable()
export class WishlistUseCaseImpl extends WishlistUseCase {
  constructor(private readonly wishlistRepository: WishlistRepository) {
    super();
  }

  async getWishlistByUserId(userId: string): Promise<WishlistEntity> {
    let wishlist = await this.wishlistRepository.findWishlistByUserId(userId);
    if (!wishlist) {
      wishlist = new WishlistEntity();
      wishlist.user_id = userId;
      wishlist = await this.wishlistRepository.saveWishlist(wishlist);
    }
    return wishlist;
  }

  async addItem(
    wishlistId: string,
    productId: string,
  ): Promise<WishlistItemEntity> {
    const wishlist = await this.wishlistRepository.findWishlistById(wishlistId);
    if (!wishlist) throw new NotFoundException('Wishlist not found');
    const item = new WishlistItemEntity();
    item.wishlist = wishlist;
    item.product_id = productId;
    return this.wishlistRepository.addItem(item);
  }

  async removeItem(wishlistItemId: string): Promise<void> {
    return this.wishlistRepository.removeItem(wishlistItemId);
  }

  async clearWishlistByUserId(userId: string): Promise<void> {
    const wishlist = await this.wishlistRepository.findWishlistByUserId(userId);
    if (!wishlist) throw new NotFoundException('Wishlist not found');
    return this.wishlistRepository.clearWishlist(wishlist.wishlist_id);
  }
}
