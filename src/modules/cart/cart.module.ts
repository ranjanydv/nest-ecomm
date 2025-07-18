import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartUseCaseImpl } from 'src/core/application/usecases/cart/cart.usecase';
import { CartUseCase } from 'src/core/ports/in/cart/cart-usecase.port';
import { CartRepository } from 'src/core/ports/out/cart/cart-repository.port';
import { CartController } from 'src/frameworks/primary/controllers/cart/cart.controller';
import { CartEntity } from 'src/frameworks/secondary/cart/cart.entity';
import { CartItemEntity } from 'src/frameworks/secondary/cart/cart-item.entity';
import { CartRepositoryImpl } from 'src/frameworks/secondary/cart/cart.repository';
import { UserEntity } from 'src/frameworks/secondary/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity, CartItemEntity, UserEntity])],
  controllers: [CartController],
  providers: [
    {
      provide: CartUseCase,
      useClass: CartUseCaseImpl,
    },
    {
      provide: CartRepository,
      useClass: CartRepositoryImpl,
    },
  ],
  exports: [CartUseCase],
})
export class CartModule {}
