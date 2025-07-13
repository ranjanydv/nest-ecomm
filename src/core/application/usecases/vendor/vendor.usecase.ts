import { BadRequestException, Injectable } from '@nestjs/common';
import { PaginationProps } from 'src/common/types/pagination.types';
import { Vendor } from 'src/core/domain/vendor/vendor.domain';
import { VendorUseCase } from 'src/core/ports/in/vendor/vendor-usecase.port';
import { VendorRepository } from 'src/core/ports/out/vendor/vendor-repository.port';
import { UserUseCase } from 'src/core/ports/in/user/user-usecase.port';

@Injectable()
export class VendorUseCaseImpl implements VendorUseCase {
  constructor(
    private readonly vendorRepository: VendorRepository,
    private readonly userUseCase: UserUseCase,
  ) {}

  async getAllVendors(
    options: Partial<Vendor>,
    filter: PaginationProps,
  ): Promise<[Vendor[], number]> {
    return await this.vendorRepository.findAllVendors([options], filter);
  }

  async getVendorById(vendorId: Vendor['vendorId']): Promise<Vendor> {
    await this.checkVendorExistsOrFail([{ vendorId }]);

    return await this.vendorRepository.findVendor({ vendorId });
  }

  async getVendorBySlug(slug: Vendor['slug']): Promise<Vendor> {
    await this.checkVendorExistsOrFail([{ slug }]);

    return await this.vendorRepository.findVendor({ slug });
  }

  async createVendor(data: Vendor): Promise<Vendor> {
    await this.userUseCase.checkUserExistsOrFail([{ userId: data.userId }]);

    return await this.vendorRepository.createVendor(data);
  }

  async createBulkVendor(data: Vendor[]): Promise<Vendor[]> {
    await this.userUseCase.checkUserExistsOrFail(
      data?.map(({ userId }) => ({ userId })),
    );

    return await this.vendorRepository.createBulkVendor(data);
  }

  async updateVendorById(
    vendorId: Vendor['vendorId'],
    data: Partial<Vendor>,
  ): Promise<void> {
    await this.checkVendorExistsOrFail([{ vendorId }]);

    if (data.userId) {
      await this.userUseCase.checkUserExistsOrFail([{ userId: data.userId }]);
    }

    return await this.vendorRepository.updateVendor({ vendorId }, data);
  }

  async checkVendorExistsOrFail(options: Partial<Vendor>[]): Promise<boolean> {
    if (await this.vendorRepository.vendorExists(options)) return true;

    throw new BadRequestException('Vendor does not exist');
  }

  async countVendors(options?: Partial<Vendor>): Promise<number> {
    return await this.vendorRepository.countVendors(options);
  }
}
