import { IsInt, IsNumberString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCartItemDto {
  @ApiProperty()
  @IsUUID()
  productId: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  variantId?: string;

  @ApiProperty()
  @IsInt()
  quantity: number;

  @ApiProperty()
  @IsNumberString()
  price: string;
}
