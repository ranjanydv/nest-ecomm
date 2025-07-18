import { PaginationProps } from 'src/common/types/pagination.types';
import { Vendor } from '../../../domain/vendor/vendor.domain';

export abstract class VendorUseCase {
  abstract getAllVendors(
    options: Partial<Vendor>,
    filter: PaginationProps,
  ): Promise<[Vendor[], number]>;

  abstract getVendorById(id: Vendor['vendorId']): Promise<Vendor>;

  abstract getVendorBySlug(slug: Vendor['slug']): Promise<Vendor>;

  abstract createVendor(data: Vendor): Promise<Vendor>;

  abstract createBulkVendor(data: Vendor[]): Promise<Vendor[]>;

  abstract updateVendorById(
    id: Vendor['vendorId'],
    data: Partial<Vendor>,
  ): Promise<void>;

  abstract checkVendorExistsOrFail(
    options: Partial<Vendor>[],
  ): Promise<boolean | never>;

  abstract countVendors(options?: Partial<Vendor>): Promise<number>;

  abstract registerVendor(
    userData: {
      userName?: string;
      email: string;
      password: string;
      phone?: string;
      image?: string;
    },
    vendorData: {
      storeName: string;
      description?: string;
      logoUrl?: string;
      bannerUrl?: string;
      websiteUrl?: string;
      phoneNumber?: string;
      establishedDate?: Date;
    },
  ): Promise<{ user: any; vendor: Vendor }>;
}
