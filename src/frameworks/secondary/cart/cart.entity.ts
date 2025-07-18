import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CartItemEntity } from './cart-item.entity';
import { UserEntity } from '../user/user.entity';

@Entity('carts')
export class CartEntity {
  @PrimaryGeneratedColumn('uuid')
  cart_id: string;

  @Column({ type: 'uuid', unique: true })
  user_id: string;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  expires_at: Date | null;

  @OneToMany(() => CartItemEntity, (item) => item.cart, { cascade: true })
  items: CartItemEntity[];
}
