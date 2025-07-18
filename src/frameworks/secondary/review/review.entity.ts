import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductEntity } from '../product/product.entity';
import { UserEntity } from '../user/user.entity';

@Entity('reviews')
export class ReviewEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  reviewId: string;

  @Column({ type: 'uuid' })
  productId: string;

  @ManyToOne(() => ProductEntity, { nullable: false })
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ type: 'int' })
  rating: number;

  @Column({ length: 255, nullable: true })
  title?: string;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @Column({ default: false })
  isApproved: boolean;

  @Column({ type: 'text', nullable: true })
  reply?: string;

  @Column({ type: 'timestamp', nullable: true })
  repliedAt?: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
