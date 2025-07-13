import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from 'src/core/domain/category/category.domain';
import { CATEGORY_STATUS } from 'src/common/enums/category/category.enum';

@Entity('category')
export class CategoryEntity extends BaseEntity implements Category {
  @PrimaryGeneratedColumn('uuid')
  categoryId: string;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ length: 100, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  parentCategoryId: string;

  @ManyToOne(() => CategoryEntity, { nullable: true })
  @JoinColumn({ name: 'parentCategoryId' })
  parentCategory: CategoryEntity;

  @OneToMany(() => CategoryEntity, (category) => category.parentCategory)
  subCategories: CategoryEntity[];

  @Column({ length: 255, nullable: true })
  iconUrl: string;

  @Column({
    type: 'enum',
    enum: CATEGORY_STATUS,
    default: CATEGORY_STATUS.ACTIVE,
  })
  status: CATEGORY_STATUS;

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
