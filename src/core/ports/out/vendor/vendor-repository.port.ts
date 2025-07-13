import { Vendor } from 'src/core/domain/vendor/vendor.domain';
import { PaginationProps } from 'src/common/types/pagination.types';

export abstract class VendorRepository {
  abstract findAllVendors(
    options: Partial<Vendor>[],
    filter: PaginationProps,
  ): Promise<[Vendor[], number]>;

  abstract findVendor(options: Partial<Vendor>): Promise<Vendor>;

  abstract createVendor(data: Vendor): Promise<Vendor>;

  abstract createBulkVendor(data: Vendor[]): Promise<Vendor[]>;

  abstract updateVendor(
    options: Pick<Vendor, 'vendorId'>,
    data: Partial<Vendor>,
  ): Promise<void>;

  abstract saveVendor(data: Vendor): Promise<Vendor>;

  abstract countVendors(options: Partial<Vendor>): Promise<number>;

  abstract vendorExists(options: Partial<Vendor>[]): Promise<boolean>;

  abstract slugExists(slug: string): Promise<boolean>;
}
