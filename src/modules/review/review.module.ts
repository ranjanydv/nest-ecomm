import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from '../../frameworks/secondary/review/review.entity';
import { ReviewRepository } from 'src/core/ports/out/review/review-repository.port';
import { ReviewRepositoryImpl } from '../../frameworks/secondary/review/review.repository';
import { ReviewUseCase } from 'src/core/ports/in/review/review-usecase.port';
import { ReviewUseCaseImpl } from 'src/core/application/usecases/review/review.usecase';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { OrderModule } from '../order/order.module';
import { ReviewController } from '../../frameworks/primary/controllers/review/review.controller';
import { VendorModule } from '../vendor/vendor.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReviewEntity]),
    ProductModule,
    UserModule,
    OrderModule,
    VendorModule,
  ],
  controllers: [ReviewController],
  providers: [
    {
      provide: ReviewUseCase,
      useClass: ReviewUseCaseImpl,
    },
    {
      provide: ReviewRepository,
      useClass: ReviewRepositoryImpl,
    },
  ],
  exports: [ReviewUseCase],
})
export class ReviewModule {}
