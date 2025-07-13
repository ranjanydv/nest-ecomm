import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from 'src/core/domain/product/product.domain';
import { VendorEntity } from '../vendor/vendor.entity';
import { PRODUCT_STATUS } from 'src/common/enums/product/product.enum';

@Entity('product')
export class ProductEntity extends BaseEntity implements Product {
  @PrimaryGeneratedColumn('uuid')
  productId: string;

  @Column({ type: 'uuid' })
  @Index()
  vendorId: string;

  @ManyToOne(() => VendorEntity, { nullable: false })
  @JoinColumn({ name: 'vendorId' })
  vendor: VendorEntity;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, unique: true })
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ length: 500, nullable: true })
  shortDescription: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salePrice: number;

  @Column({ length: 10, default: 'USD' })
  currency: string;

  @Column({ length: 50, unique: true, nullable: true })
  sku: string;

  @Column({
    type: 'enum',
    enum: PRODUCT_STATUS,
    default: PRODUCT_STATUS.DRAFT,
  })
  status: PRODUCT_STATUS;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  weight: number;

  @Column({ length: 10, nullable: true })
  weightUnit: string;

  @Column({ length: 50, nullable: true })
  dimensions: string;

  @Column({ type: 'uuid', nullable: true })
  taxClassId: string;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ type: 'int', default: 0 })
  totalSalesCount: number;

  @CreateDateColumn({
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP(0)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP(0)',
    onUpdate: 'CURRENT_TIMESTAMP(0)',
  })
  updatedAt: Date;
}
