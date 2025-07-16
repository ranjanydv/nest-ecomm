import { PaginationProps } from 'src/common/types/pagination.types';
import { Order } from '../../../domain/order/order.domain';

export abstract class OrderUseCase {
  abstract getAllOrders(
    options: Partial<Order>,
    filter: PaginationProps,
  ): Promise<[Order[], number]>;

  abstract getOrderById(id: Order['orderId']): Promise<Order>;

  abstract createOrder(data: Order): Promise<Order>;

  abstract updateOrderById(
    id: Order['orderId'],
    data: Partial<Order>,
  ): Promise<void>;

  abstract deleteOrderById(id: Order['orderId']): Promise<void>;

  abstract countOrders(options?: Partial<Order>): Promise<number>;
}
