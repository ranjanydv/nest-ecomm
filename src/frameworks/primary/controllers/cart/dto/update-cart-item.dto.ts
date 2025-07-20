import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartItemDto {
  @ApiProperty()
  @IsInt()
  quantity: number;
}
