import { IsInt, IsNumberString, IsOptional, IsUUID } from 'class-validator';

export class CreateCartItemDto {
  @IsUUID()
  productId: string;

  @IsUUID()
  @IsOptional()
  variantId?: string;

  @IsInt()
  quantity: number;

  @IsNumberString()
  price: string;
}
