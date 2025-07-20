import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
  JoinColumn,
} from 'typeorm';
import { WishlistEntity } from './wishlist.entity';
import { ProductEntity } from '../product/product.entity';

@Entity('wishlist_items')
@Unique(['wishlist_id', 'product_id'])
export class WishlistItemEntity {
  @PrimaryGeneratedColumn('uuid')
  wishlist_item_id: string;

  @Column({ type: 'uuid' })
  wishlist_id: string;

  @ManyToOne(() => WishlistEntity, (wishlist) => wishlist.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'wishlist_id' })
  wishlist: WishlistEntity;

  @Column({ type: 'uuid' })
  product_id: string;

  @ManyToOne(() => ProductEntity, { nullable: false })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @CreateDateColumn()
  added_at: Date;
} 