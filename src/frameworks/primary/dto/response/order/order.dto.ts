/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ApiProperty } from '@nestjs/swagger';
import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  ORDER_ITEM_STATUS,
} from 'src/common/enums/order/order.enum';

export class OrderItemResponseDto {
  @ApiProperty()
  orderItemId: string;

  @ApiProperty()
  productId: string;

  @ApiProperty({ required: false })
  variantId?: string;

  @ApiProperty()
  vendorId: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unitPrice: number;

  @ApiProperty()
  totalItemPrice: number;

  @ApiProperty({ enum: ORDER_ITEM_STATUS })
  itemStatus: ORDER_ITEM_STATUS;

  constructor(entity: Record<string, any>) {
    this.orderItemId = entity.orderItemId;
    this.productId = entity.productId;
    this.variantId = entity.variantId;
    this.vendorId = entity.vendorId;
    this.quantity = entity.quantity;
    this.unitPrice = entity.unitPrice;
    this.totalItemPrice = entity.totalItemPrice;
    this.itemStatus = entity.itemStatus;
  }
}

export class OrderResponseDto {
  @ApiProperty()
  orderId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  orderDate: Date;

  @ApiProperty({ enum: ORDER_STATUS })
  status: ORDER_STATUS;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty({ required: false })
  shippingAddressId?: string;

  @ApiProperty({ required: false })
  billingAddressId?: string;

  @ApiProperty()
  paymentMethod: string;

  @ApiProperty({ enum: PAYMENT_STATUS })
  paymentStatus: PAYMENT_STATUS;

  @ApiProperty({ required: false })
  shippingMethodId?: string;

  @ApiProperty({ default: 0 })
  shippingCost: number;

  @ApiProperty({ default: 0 })
  taxAmount: number;

  @ApiProperty({ default: 0 })
  discountAmount: number;

  @ApiProperty({ required: false })
  notes?: string;

  @ApiProperty({ required: false })
  trackingNumber?: string;

  @ApiProperty({ type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(entity: Record<string, any>) {
    this.orderId = entity.orderId;
    this.userId = entity.userId;
    this.orderDate = entity.orderDate;
    this.status = entity.status;
    this.totalAmount = entity.totalAmount;
    this.shippingAddressId = entity.shippingAddressId;
    this.billingAddressId = entity.billingAddressId;
    this.paymentMethod = entity.paymentMethod;
    this.paymentStatus = entity.paymentStatus;
    this.shippingMethodId = entity.shippingMethodId;
    this.shippingCost = entity.shippingCost;
    this.taxAmount = entity.taxAmount;
    this.discountAmount = entity.discountAmount;
    this.notes = entity.notes;
    this.trackingNumber = entity.trackingNumber;
    this.items = Array.isArray(entity.items)
      ? entity.items.map((item) => new OrderItemResponseDto(item))
      : [];
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
