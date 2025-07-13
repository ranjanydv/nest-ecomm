import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorUseCaseImpl } from 'src/core/application/usecases/vendor/vendor.usecase';
import { VendorUseCase } from 'src/core/ports/in/vendor/vendor-usecase.port';
import { VendorRepository } from 'src/core/ports/out/vendor/vendor-repository.port';
import { VendorController } from 'src/frameworks/primary/controllers/vendor/vendor.controller';
import { VendorEntity } from '../../frameworks/secondary/vendor/vendor.entity';
import { VendorRepositoryImpl } from '../../frameworks/secondary/vendor/vendor.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([VendorEntity]), UserModule],
  controllers: [VendorController],
  providers: [
    {
      provide: VendorUseCase,
      useClass: VendorUseCaseImpl,
    },
    {
      provide: VendorRepository,
      useClass: VendorRepositoryImpl,
    },
  ],
  exports: [VendorUseCase],
})
export class VendorModule {}
