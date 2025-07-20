import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistRepository } from 'src/core/ports/out/wishlist/wishlist-repository.port';
import { WishlistEntity } from './wishlist.entity';
import { WishlistItemEntity } from './wishlist-item.entity';

@Injectable()
export class WishlistRepositoryImpl extends WishlistRepository {
  constructor(
    @InjectRepository(WishlistEntity)
    private readonly wishlistRepo: Repository<WishlistEntity>,
    @InjectRepository(WishlistItemEntity)
    private readonly wishlistItemRepo: Repository<WishlistItemEntity>,
  ) {
    super();
  }

  async findWishlistById(wishlistId: string): Promise<WishlistEntity | null> {
    return this.wishlistRepo.findOne({
      where: { wishlist_id: wishlistId },
      relations: ['items'],
    });
  }

  async findWishlistByUserId(userId: string): Promise<WishlistEntity | null> {
    return this.wishlistRepo.findOne({
      where: { user_id: userId },
      relations: ['items'],
    });
  }

  async saveWishlist(wishlist: WishlistEntity): Promise<WishlistEntity> {
    return this.wishlistRepo.save(wishlist);
  }

  async addItem(wishlistItem: WishlistItemEntity): Promise<WishlistItemEntity> {
    return this.wishlistItemRepo.save(wishlistItem);
  }

  async removeItem(wishlistItemId: string): Promise<void> {
    await this.wishlistItemRepo.delete({ wishlist_item_id: wishlistItemId });
  }

  async clearWishlist(wishlistId: string): Promise<void> {
    await this.wishlistItemRepo.delete({
      wishlist: { wishlist_id: wishlistId },
    });
  }
}
