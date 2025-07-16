import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  ORDER_ITEM_STATUS,
} from 'src/common/enums/order/order.enum';
import { QueryDto } from '../query.dto';

export class QueryOrderDto extends QueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  userId?: string;

  @ApiProperty({ required: false, enum: ORDER_STATUS })
  @IsEnum(ORDER_STATUS)
  @IsOptional()
  status?: ORDER_STATUS;

  @ApiProperty({ required: false })
  @IsOptional()
  search?: string;
}

export class CreateOrderItemDto {
  @ApiProperty()
  @IsUUID()
  productId: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  variantId?: string;

  @ApiProperty()
  @IsUUID()
  vendorId: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty()
  @IsNumber()
  unitPrice: number;

  @ApiProperty()
  @IsNumber()
  totalItemPrice: number;

  @ApiProperty({ enum: ORDER_ITEM_STATUS })
  @IsEnum(ORDER_ITEM_STATUS)
  itemStatus: ORDER_ITEM_STATUS;
}

export class CreateOrderDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsDateString()
  orderDate: string;

  @ApiProperty({ enum: ORDER_STATUS })
  @IsEnum(ORDER_STATUS)
  status: ORDER_STATUS;

  @ApiProperty()
  @IsNumber()
  totalAmount: number;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  shippingAddressId?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  billingAddressId?: string;

  @ApiProperty()
  @IsString()
  paymentMethod: string;

  @ApiProperty({ enum: PAYMENT_STATUS })
  @IsEnum(PAYMENT_STATUS)
  paymentStatus: PAYMENT_STATUS;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  shippingMethodId?: string;

  @ApiProperty({ default: 0 })
  @IsNumber()
  shippingCost: number;

  @ApiProperty({ default: 0 })
  @IsNumber()
  taxAmount: number;

  @ApiProperty({ default: 0 })
  @IsNumber()
  discountAmount: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  trackingNumber?: string;

  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}

export class UpdateOrderItemDto extends PartialType(CreateOrderItemDto) {}
