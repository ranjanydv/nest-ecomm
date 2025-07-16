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
import { Address } from 'src/core/domain/address/address.domain';
import { UserEntity } from '../user/user.entity';
import { VendorEntity } from '../vendor/vendor.entity';
import { ADDRESS_TYPE } from 'src/common/enums/address/address.enum';

@Entity('address')
export class AddressEntity extends BaseEntity implements Address {
  @PrimaryGeneratedColumn('uuid')
  addressId: string;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  userId: string;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  vendorId: string;

  @ManyToOne(() => VendorEntity, { nullable: true })
  @JoinColumn({ name: 'vendorId' })
  vendor: VendorEntity;

  @Column({ length: 100 })
  addressLine1: string;

  @Column({ length: 100, nullable: true })
  addressLine2: string;

  @Column({ length: 50 })
  city: string;

  @Column({ length: 50 })
  stateProvince: string;

  @Column({ length: 20 })
  postalCode: string;

  @Column({ length: 50 })
  country: string;

  @Column({
    type: 'enum',
    enum: ADDRESS_TYPE,
  })
  addressType: ADDRESS_TYPE;

  @Column({ default: false })
  isDefault: boolean;

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
