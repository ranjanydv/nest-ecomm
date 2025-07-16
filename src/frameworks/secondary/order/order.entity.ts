import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  ORDER_STATUS,
  PAYMENT_STATUS,
} from 'src/common/enums/order/order.enum';
import { UserEntity } from '../user/user.entity';
import { AddressEntity } from '../address/address.entity';
import { OrderItemEntity } from './order-item.entity';

@Entity('orders')
export class OrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  orderId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ type: 'timestamp' })
  orderDate: Date;

  @Column({ type: 'enum', enum: ORDER_STATUS })
  status: ORDER_STATUS;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'uuid', nullable: true })
  shippingAddressId?: string;

  @ManyToOne(() => AddressEntity, { nullable: true })
  @JoinColumn({ name: 'shippingAddressId' })
  shippingAddress?: AddressEntity;

  @Column({ type: 'uuid', nullable: true })
  billingAddressId?: string;

  @ManyToOne(() => AddressEntity, { nullable: true })
  @JoinColumn({ name: 'billingAddressId' })
  billingAddress?: AddressEntity;

  @Column({ type: 'varchar', length: 50 })
  paymentMethod: string;

  @Column({ type: 'enum', enum: PAYMENT_STATUS })
  paymentStatus: PAYMENT_STATUS;

  @Column({ type: 'uuid', nullable: true })
  shippingMethodId?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  shippingCost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  trackingNumber?: string;

  @OneToMany(() => OrderItemEntity, (item) => item.order, { cascade: true })
  items: OrderItemEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
} 