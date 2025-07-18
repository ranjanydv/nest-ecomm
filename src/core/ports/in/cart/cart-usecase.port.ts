import { CartEntity } from 'src/frameworks/secondary/cart/cart.entity';
import { CartItemEntity } from 'src/frameworks/secondary/cart/cart-item.entity';

export abstract class CartUseCase {
  abstract getCart(cartId: string): Promise<CartEntity>;

  abstract addItem(
    cartId: string,
    productId: string,
    variantId: string | null,
    quantity: number,
    price: string,
  ): Promise<CartItemEntity>;

  abstract updateItem(
    cartItemId: string,
    quantity: number,
  ): Promise<CartItemEntity>;

  abstract removeItem(cartItemId: string): Promise<void>;

  abstract clearCart(cartId: string): Promise<void>;
} 