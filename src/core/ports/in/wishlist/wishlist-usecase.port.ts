import { WishlistEntity } from 'src/frameworks/secondary/wishlist/wishlist.entity';
import { WishlistItemEntity } from 'src/frameworks/secondary/wishlist/wishlist-item.entity';

export abstract class WishlistUseCase {
  abstract getWishlistByUserId(userId: string): Promise<WishlistEntity>;
  abstract addItem(
    wishlistId: string,
    productId: string,
  ): Promise<WishlistItemEntity>;
  abstract removeItem(wishlistItemId: string): Promise<void>;
  abstract clearWishlistByUserId(userId: string): Promise<void>;
}
