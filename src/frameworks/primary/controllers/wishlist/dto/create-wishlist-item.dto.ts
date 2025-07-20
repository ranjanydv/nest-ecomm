import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWishlistItemDto {
  @ApiProperty()
  @IsUUID()
  productId: string;
}
