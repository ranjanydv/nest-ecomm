import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  ORDER_ITEM_STATUS,
} from 'src/common/enums/order/order.enum';

export interface Order {
  orderId: string;
  userId: string;
  orderDate: Date;
  status: ORDER_STATUS;
  totalAmount: number;
  shippingAddressId?: string;
  billingAddressId?: string;
  paymentMethod: string;
  paymentStatus: PAYMENT_STATUS;
  shippingMethodId?: string;
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  notes?: string;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
  items?: OrderItem[];
}

export interface OrderItem {
  orderItemId: string;
  orderId: string;
  productId: string;
  variantId?: string;
  vendorId: string;
  quantity: number;
  unitPrice: number;
  totalItemPrice: number;
  itemStatus: ORDER_ITEM_STATUS;
} 