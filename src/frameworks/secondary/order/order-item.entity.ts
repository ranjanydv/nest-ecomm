import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ORDER_ITEM_STATUS } from 'src/common/enums/order/order.enum';
import { ProductEntity } from '../product/product.entity';
import { VendorEntity } from '../vendor/vendor.entity';
import { OrderEntity } from './order.entity';

@Entity('order_items')
export class OrderItemEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  orderItemId: string;

  @Column({ type: 'uuid' })
  orderId: string;

  @ManyToOne(() => OrderEntity, (order) => order.items)
  @JoinColumn({ name: 'orderId' })
  order: OrderEntity;

  @Column({ type: 'uuid' })
  productId: string;

  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;

  @Column({ type: 'uuid', nullable: true })
  variantId?: string;

  @Column({ type: 'uuid' })
  vendorId: string;

  @ManyToOne(() => VendorEntity)
  @JoinColumn({ name: 'vendorId' })
  vendor: VendorEntity;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalItemPrice: number;

  @Column({ type: 'enum', enum: ORDER_ITEM_STATUS })
  itemStatus: ORDER_ITEM_STATUS;
}
