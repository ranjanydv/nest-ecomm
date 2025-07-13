import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductUseCaseImpl } from 'src/core/application/usecases/product/product.usecase';
import { ProductUseCase } from 'src/core/ports/in/product/product-usecase.port';
import { ProductRepository } from 'src/core/ports/out/product/product-repository.port';
import { ProductController } from 'src/frameworks/primary/controllers/product/product.controller';
import { ProductEntity } from '../../frameworks/secondary/product/product.entity';
import { ProductRepositoryImpl } from '../../frameworks/secondary/product/product.repository';
import { VendorModule } from '../vendor/vendor.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity]), VendorModule],
  controllers: [ProductController],
  providers: [
    {
      provide: ProductUseCase,
      useClass: ProductUseCaseImpl,
    },
    {
      provide: ProductRepository,
      useClass: ProductRepositoryImpl,
    },
  ],
  exports: [ProductUseCase],
})
export class ProductModule {}
