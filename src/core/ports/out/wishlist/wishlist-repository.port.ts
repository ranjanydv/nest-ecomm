import { WishlistEntity } from 'src/frameworks/secondary/wishlist/wishlist.entity';
import { WishlistItemEntity } from 'src/frameworks/secondary/wishlist/wishlist-item.entity';

export abstract class WishlistRepository {
  abstract findWishlistById(wishlistId: string): Promise<WishlistEntity | null>;
  abstract saveWishlist(wishlist: WishlistEntity): Promise<WishlistEntity>;
  abstract addItem(
    wishlistItem: WishlistItemEntity,
  ): Promise<WishlistItemEntity>;
  abstract removeItem(wishlistItemId: string): Promise<void>;
  abstract clearWishlist(wishlistId: string): Promise<void>;
  abstract findWishlistByUserId(userId: string): Promise<WishlistEntity | null>;
}
