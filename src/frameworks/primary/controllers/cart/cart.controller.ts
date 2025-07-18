import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { CartUseCase } from 'src/core/ports/in/cart/cart-usecase.port';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { User } from 'src/core/domain/user/user.domain';
import { AuthUser } from '../../decorators/user.decorator';

@ApiBearerAuth()
@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartUseCase: CartUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Get current user cart' })
  @ApiResponse({ status: 200, description: 'Cart fetched' })
  getCart(@AuthUser() user: User) {
    return this.cartUseCase.getCartByUserId(user.userId);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiBody({ type: CreateCartItemDto })
  addItem(@AuthUser() user: User, @Body() dto: CreateCartItemDto) {
    return this.cartUseCase.addItem(
      user.userId,
      dto.productId,
      dto.variantId ?? null,
      dto.quantity,
      dto.price,
    );
  }

  @Patch('items/:cartItemId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiBody({ type: UpdateCartItemDto })
  updateItem(
    @Param('cartItemId') cartItemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartUseCase.updateItem(cartItemId, dto.quantity);
  }

  @Delete('items/:cartItemId')
  @ApiOperation({ summary: 'Remove item from cart' })
  removeItem(@Param('cartItemId') cartItemId: string) {
    return this.cartUseCase.removeItem(cartItemId);
  }

  @Delete('items')
  @ApiOperation({ summary: 'Clear all items from cart' })
  clearCart(@AuthUser() user: User) {
    return this.cartUseCase.clearCartByUserId(user.userId);
  }
}
