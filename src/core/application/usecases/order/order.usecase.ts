import { Injectable } from '@nestjs/common';
import { OrderUseCase } from 'src/core/ports/in/order/order-usecase.port';
import { OrderRepository } from 'src/core/ports/out/order/order-repository.port';
import { Order } from 'src/core/domain/order/order.domain';
import { PaginationProps } from 'src/common/types/pagination.types';

@Injectable()
export class OrderUseCaseImpl implements OrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async getAllOrders(
    options: Partial<Order>,
    filter: PaginationProps,
  ): Promise<[Order[], number]> {
    // TODO: Implement pagination logic if needed
    const orders = await this.orderRepository.findAll(options);
    return [orders, orders.length];
  }

  async getOrderById(id: Order['orderId']): Promise<Order> {
    return this.orderRepository.findById(id);
  }

  async createOrder(data: Order): Promise<Order> {
    return this.orderRepository.create(data);
  }

  async updateOrderById(
    id: Order['orderId'],
    data: Partial<Order>,
  ): Promise<void> {
    return this.orderRepository.update(id, data);
  }

  async deleteOrderById(id: Order['orderId']): Promise<void> {
    return this.orderRepository.delete(id);
  }

  async countOrders(options?: Partial<Order>): Promise<number> {
    return this.orderRepository.count(options);
  }
}
