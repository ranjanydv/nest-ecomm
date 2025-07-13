import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { VendorEntity } from './vendor.entity';
import { PaginationProps } from 'src/common/types/pagination.types';
import { Vendor } from 'src/core/domain/vendor/vendor.domain';
import { VendorRepository } from 'src/core/ports/out/vendor/vendor-repository.port';
import { getPaginationSortParams } from 'src/utils/util.index';

@Injectable()
export class VendorRepositoryImpl implements VendorRepository {
  constructor(
    @InjectRepository(VendorEntity)
    private readonly vendorRepository: Repository<VendorEntity>,
  ) {}

  async findAllVendors(
    options: Partial<Vendor>[],
    filter: PaginationProps,
  ): Promise<[Vendor[], number]> {
    const baseCondition = (options: Partial<Vendor>) => [
      { storeName: ILike(`%${filter?.search || ''}%`), ...options },
      { slug: ILike(`%${filter?.search || ''}%`), ...options },
      { email: ILike(`%${filter?.search || ''}%`), ...options },
    ];

    const condition: FindOptionsWhere<Vendor>[] = options?.flatMap((opt) =>
      baseCondition(opt),
    );

    const vendors = await this.vendorRepository.find({
      where: condition,
      relations: {
        user: true,
      },
      ...getPaginationSortParams(filter),
    });

    const count = await this.vendorRepository.count({ where: condition });

    return [Vendor.toDomains(vendors), count] as [Vendor[], number];
  }

  async findVendor(options: Partial<Vendor>): Promise<Vendor> {
    return Vendor.toDomain(
      await this.vendorRepository.findOneOrFail({
        where: options,
        relations: {
          user: true,
        },
      }),
    );
  }

  async createVendor(data: Vendor): Promise<Vendor> {
    return Vendor.toDomain(
      await this.vendorRepository.save(this.vendorRepository.create(data)),
    );
  }

  async createBulkVendor(data: Vendor[]): Promise<Vendor[]> {
    return Vendor.toDomains(
      await this.vendorRepository.save(this.vendorRepository.create(data)),
    );
  }

  async updateVendor(
    options: Pick<Vendor, 'vendorId'>,
    data: Partial<Vendor>,
  ): Promise<void> {
    await this.vendorRepository.update(options, data);
  }

  async saveVendor(data: Vendor): Promise<Vendor> {
    return Vendor.toDomain(await this.vendorRepository.save(data));
  }

  async vendorExists(options: Partial<Vendor>[]): Promise<boolean> {
    return await this.vendorRepository.existsBy(options);
  }

  async countVendors(options: Partial<Vendor>): Promise<number> {
    return await this.vendorRepository.countBy(options);
  }

  async slugExists(slug: string): Promise<boolean> {
    return await this.vendorRepository.existsBy({ slug });
  }
}
