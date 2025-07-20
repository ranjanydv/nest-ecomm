import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistUseCaseImpl } from 'src/core/application/usecases/wishlist/wishlist.usecase';
import { WishlistUseCase } from 'src/core/ports/in/wishlist/wishlist-usecase.port';
import { WishlistRepository } from 'src/core/ports/out/wishlist/wishlist-repository.port';
import { WishlistController } from 'src/frameworks/primary/controllers/wishlist/wishlist.controller';
import { WishlistEntity } from 'src/frameworks/secondary/wishlist/wishlist.entity';
import { WishlistItemEntity } from 'src/frameworks/secondary/wishlist/wishlist-item.entity';
import { WishlistRepositoryImpl } from 'src/frameworks/secondary/wishlist/wishlist.repository';
import { UserEntity } from 'src/frameworks/secondary/user/user.entity';
import { ProductEntity } from 'src/frameworks/secondary/product/product.entity';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WishlistEntity,
      WishlistItemEntity,
      UserEntity,
      ProductEntity,
    ]),
    ProductModule,
  ],
  controllers: [WishlistController],
  providers: [
    {
      provide: WishlistUseCase,
      useClass: WishlistUseCaseImpl,
    },
    {
      provide: WishlistRepository,
      useClass: WishlistRepositoryImpl,
    },
  ],
  exports: [WishlistUseCase, WishlistRepository],
})
export class WishlistModule {}
