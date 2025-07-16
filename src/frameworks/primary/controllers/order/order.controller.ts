import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrderUseCase } from 'src/core/ports/in/order/order-usecase.port';
import { ResponseDto } from '../../dto/response/response.dto';
import {
  CreateOrderDto,
  UpdateOrderDto,
  QueryOrderDto,
} from '../../dto/request/order/order.dto';
import { OrderResponseDto } from '../../dto/response/order/order.dto';

@ApiBearerAuth()
@ApiTags('Order')
@Controller('/orders')
export class OrderController {
  constructor(private readonly orderUseCase: OrderUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  async getAll(@Query() query: QueryOrderDto) {
    const [orders, count] = await this.orderUseCase.getAllOrders({}, query);
    const data = orders.map((order) => new OrderResponseDto(order));
    return new ResponseDto('Orders Fetched', data, {
      count,
      page: (query as any).page ?? 1,
      size: (query as any).size ?? data.length,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by id' })
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const order = await this.orderUseCase.getOrderById(id);
    return new ResponseDto('Order Fetched', new OrderResponseDto(order));
  }

  @Post()
  @ApiOperation({ summary: 'Create order' })
  async create(@Body() body: CreateOrderDto) {
    const order = await this.orderUseCase.createOrder(body as any);
    return new ResponseDto('Order Created', new OrderResponseDto(order));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update order' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateOrderDto,
  ) {
    await this.orderUseCase.updateOrderById(id, body as any);
    return new ResponseDto('Order Updated');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete order' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.orderUseCase.deleteOrderById(id);
    return new ResponseDto('Order Deleted');
  }
}
