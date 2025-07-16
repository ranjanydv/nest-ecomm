import { Order } from '../../../domain/order/order.domain';

export abstract class OrderRepository {
  abstract findAll(options: Partial<Order>): Promise<Order[]>;
  abstract findById(id: Order['orderId']): Promise<Order>;
  abstract create(order: Order): Promise<Order>;
  abstract update(id: Order['orderId'], data: Partial<Order>): Promise<void>;
  abstract delete(id: Order['orderId']): Promise<void>;
  abstract count(options?: Partial<Order>): Promise<number>;
} 