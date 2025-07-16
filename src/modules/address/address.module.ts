import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressUseCaseImpl } from 'src/core/application/usecases/address/address.usecase';
import { AddressUseCase } from 'src/core/ports/in/address/address-usecase.port';
import { AddressRepository } from 'src/core/ports/out/address/address-repository.port';
import { AddressController } from 'src/frameworks/primary/controllers/address/address.controller';
import { AddressEntity } from '../../frameworks/secondary/address/address.entity';
import { AddressRepositoryImpl } from '../../frameworks/secondary/address/address.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity])],
  controllers: [AddressController],
  providers: [
    {
      provide: AddressUseCase,
      useClass: AddressUseCaseImpl,
    },
    {
      provide: AddressRepository,
      useClass: AddressRepositoryImpl,
    },
  ],
  exports: [AddressUseCase],
})
export class AddressModule {}
