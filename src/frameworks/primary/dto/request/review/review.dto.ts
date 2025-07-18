import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  Length,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty()
  @IsUUID()
  productId: string;

  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty({ minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ required: false, maxLength: 255 })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  comment?: string;
}

export class UpdateReviewDto {
  @ApiProperty({ required: false, minimum: 1, maximum: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiProperty({ required: false, maxLength: 255 })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;
}

export class ReplyReviewDto {
  @ApiProperty()
  @IsString()
  reply: string;
}

export class ApproveReviewDto {
  @ApiProperty()
  @IsBoolean()
  isApproved: boolean;
}
