import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { WishlistItemEntity } from './wishlist-item.entity';

@Entity('wishlists')
@Unique(['user_id'])
export class WishlistEntity {
  @PrimaryGeneratedColumn('uuid')
  wishlist_id: string;

  @Column({ type: 'uuid', unique: true })
  user_id: string;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'varchar', length: 100, default: 'My Wishlist' })
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(
    () => WishlistItemEntity,
    (item: WishlistItemEntity) => item.wishlist,
    {
      cascade: true,
    },
  )
  items: WishlistItemEntity[];
}
