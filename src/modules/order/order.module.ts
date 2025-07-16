import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderUseCaseImpl } from 'src/core/application/usecases/order/order.usecase';
import { OrderUseCase } from 'src/core/ports/in/order/order-usecase.port';
import { OrderRepository } from 'src/core/ports/out/order/order-repository.port';
import { OrderController } from 'src/frameworks/primary/controllers/order/order.controller';
import { OrderEntity } from '../../frameworks/secondary/order/order.entity';
import { OrderRepositoryImpl } from '../../frameworks/secondary/order/order.repository';
import { OrderItemEntity } from '../../frameworks/secondary/order/order-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, OrderItemEntity])],
  controllers: [OrderController],
  providers: [
    {
      provide: OrderUseCase,
      useClass: OrderUseCaseImpl,
    },
    {
      provide: OrderRepository,
      useClass: OrderRepositoryImpl,
    },
  ],
  exports: [OrderUseCase],
})
export class OrderModule {} 