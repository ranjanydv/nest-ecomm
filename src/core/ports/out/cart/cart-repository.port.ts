import { CartEntity } from 'src/frameworks/secondary/cart/cart.entity';
import { CartItemEntity } from 'src/frameworks/secondary/cart/cart-item.entity';

export abstract class CartRepository {
  abstract findCartById(cartId: string): Promise<CartEntity | null>;
  abstract saveCart(cart: CartEntity): Promise<CartEntity>;
  abstract addItem(cartItem: CartItemEntity): Promise<CartItemEntity>;
  abstract updateItem(cartItem: CartItemEntity): Promise<CartItemEntity>;
  abstract removeItem(cartItemId: string): Promise<void>;
  abstract clearCart(cartId: string): Promise<void>;
} 