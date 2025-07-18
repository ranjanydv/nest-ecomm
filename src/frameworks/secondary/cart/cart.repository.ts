import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartRepository } from 'src/core/ports/out/cart/cart-repository.port';
import { CartEntity } from './cart.entity';
import { CartItemEntity } from './cart-item.entity';

@Injectable()
export class CartRepositoryImpl extends CartRepository {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepo: Repository<CartEntity>,
    @InjectRepository(CartItemEntity)
    private readonly cartItemRepo: Repository<CartItemEntity>,
  ) {
    super();
  }

  async findCartById(cartId: string): Promise<CartEntity | null> {
    return this.cartRepo.findOne({
      where: { cart_id: cartId },
      relations: ['items'],
    });
  }

  async findCartByUserId(userId: string): Promise<CartEntity | null> {
    return this.cartRepo.findOne({
      where: { user_id: userId },
      relations: ['items'],
    });
  }

  async saveCart(cart: CartEntity): Promise<CartEntity> {
    return this.cartRepo.save(cart);
  }

  async addItem(cartItem: CartItemEntity): Promise<CartItemEntity> {
    return this.cartItemRepo.save(cartItem);
  }

  async updateItem(cartItem: CartItemEntity): Promise<CartItemEntity> {
    return this.cartItemRepo.save(cartItem);
  }

  async removeItem(cartItemId: string): Promise<void> {
    await this.cartItemRepo.delete({ cart_item_id: cartItemId });
  }

  async clearCart(cartId: string): Promise<void> {
    await this.cartItemRepo.delete({ cart: { cart_id: cartId } });
  }
}
