import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { OrderUseCase } from 'src/core/ports/in/order/order-usecase.port';
import { Order } from 'src/core/domain/order/order.domain';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderUseCase: OrderUseCase) {}

  @Get()
  async getAll(@Query() query: any) {
    // TODO: Add pagination and filtering
    return this.orderUseCase.getAllOrders({}, { pagination: false } as any);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.orderUseCase.getOrderById(id);
  }

  @Post()
  async create(@Body() body: Order) {
    return this.orderUseCase.createOrder(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Partial<Order>) {
    return this.orderUseCase.updateOrderById(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.orderUseCase.deleteOrderById(id);
  }
} 