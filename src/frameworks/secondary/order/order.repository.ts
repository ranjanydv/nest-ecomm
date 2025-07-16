import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderRepository } from 'src/core/ports/out/order/order-repository.port';
import { OrderEntity } from './order.entity';
import { Order } from 'src/core/domain/order/order.domain';

@Injectable()
export class OrderRepositoryImpl implements OrderRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly repo: Repository<OrderEntity>,
  ) {}

  async findAll(options: Partial<Order>): Promise<Order[]> {
    return this.repo.find({ where: options });
  }

  async findById(id: Order['orderId']): Promise<Order> {
    return this.repo.findOne({ where: { orderId: id } });
  }

  async create(order: Order): Promise<Order> {
    return this.repo.save(order);
  }

  async update(id: Order['orderId'], data: Partial<Order>): Promise<void> {
    await this.repo.update(id, data);
  }

  async delete(id: Order['orderId']): Promise<void> {
    await this.repo.delete(id);
  }

  async count(options?: Partial<Order>): Promise<number> {
    return this.repo.count({ where: options });
  }
}
