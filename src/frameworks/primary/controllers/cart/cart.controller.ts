import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CartUseCase } from 'src/core/ports/in/cart/cart-usecase.port';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartUseCase: CartUseCase) {}

  @Get(':cartId')
  getCart(@Param('cartId') cartId: string) {
    return this.cartUseCase.getCart(cartId);
  }

  @Post(':cartId/items')
  addItem(@Param('cartId') cartId: string, @Body() dto: CreateCartItemDto) {
    return this.cartUseCase.addItem(
      cartId,
      dto.productId,
      dto.variantId ?? null,
      dto.quantity,
      dto.price,
    );
  }

  @Patch('items/:cartItemId')
  updateItem(
    @Param('cartItemId') cartItemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartUseCase.updateItem(cartItemId, dto.quantity);
  }

  @Delete('items/:cartItemId')
  removeItem(@Param('cartItemId') cartItemId: string) {
    return this.cartUseCase.removeItem(cartItemId);
  }

  @Delete(':cartId/items')
  clearCart(@Param('cartId') cartId: string) {
    return this.cartUseCase.clearCart(cartId);
  }
}
