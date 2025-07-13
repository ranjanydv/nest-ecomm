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
import { Vendor } from 'src/core/domain/vendor/vendor.domain';
import { UserEntity } from '../user/user.entity';
import { VENDOR_STATUS } from 'src/common/enums/vendor/vendor.enum';

@Entity('vendor')
export class VendorEntity extends BaseEntity implements Vendor {
  @PrimaryGeneratedColumn('uuid')
  vendorId: string;

  @Column({ type: 'uuid' })
  @Index()
  userId: string;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ length: 100, unique: true })
  storeName: string;

  @Column({ length: 100, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 255, nullable: true })
  logoUrl: string;

  @Column({ length: 255, nullable: true })
  bannerUrl: string;

  @Column({ length: 255, nullable: true })
  websiteUrl: string;

  @Column({ length: 20, nullable: true })
  phoneNumber: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ type: 'date', nullable: true })
  establishedDate: Date;

  @Column({
    type: 'enum',
    enum: VENDOR_STATUS,
    default: VENDOR_STATUS.PENDING_APPROVAL,
  })
  status: VENDOR_STATUS;

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
