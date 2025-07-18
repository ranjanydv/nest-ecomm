import { ApiProperty } from '@nestjs/swagger';

export class ReviewResponseDto {
  @ApiProperty()
  reviewId: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  rating: number;

  @ApiProperty({ required: false })
  title?: string;

  @ApiProperty({ required: false })
  comment?: string;

  @ApiProperty()
  isApproved: boolean;

  @ApiProperty({ required: false })
  reply?: string;

  @ApiProperty({ required: false })
  repliedAt?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
