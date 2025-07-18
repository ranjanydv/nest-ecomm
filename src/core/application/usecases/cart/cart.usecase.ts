import { Injectable, NotFoundException } from '@nestjs/common';
import { CartUseCase } from 'src/core/ports/in/cart/cart-usecase.port';
import { CartRepository } from 'src/core/ports/out/cart/cart-repository.port';
import { CartEntity } from 'src/frameworks/secondary/cart/cart.entity';
import { CartItemEntity } from 'src/frameworks/secondary/cart/cart-item.entity';

@Injectable()
export class CartUseCaseImpl extends CartUseCase {
  constructor(private readonly cartRepository: CartRepository) {
    super();
  }

  async getCart(cartId: string): Promise<CartEntity> {
    const cart = await this.cartRepository.findCartById(cartId);
    if (!cart) throw new NotFoundException('Cart not found');
    return cart;
  }

  async addItem(
    cartId: string,
    productId: string,
    variantId: string | null,
    quantity: number,
    price: string,
  ): Promise<CartItemEntity> {
    const cart = await this.getCart(cartId);
    const item = new CartItemEntity();
    item.cart = cart;
    item.product_id = productId;
    item.variant_id = variantId;
    item.quantity = quantity;
    item.price_at_addition = price;
    return this.cartRepository.addItem(item);
  }

  async updateItem(
    cartItemId: string,
    quantity: number,
  ): Promise<CartItemEntity> {
    // Implementation would fetch, update, and save the item
    const cart = null; // placeholder
    const item = null; // placeholder
    // ...
    throw new Error('Not implemented');
  }

  async removeItem(cartItemId: string): Promise<void> {
    return this.cartRepository.removeItem(cartItemId);
  }

  async clearCart(cartId: string): Promise<void> {
    return this.cartRepository.clearCart(cartId);
  }
}
