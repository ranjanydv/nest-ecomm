import { z } from 'zod';
import { plainToInstance } from 'class-transformer';
import { CreateVendorProps, UpdateVendorProps } from './vendor.types';
import { VENDOR_STATUS } from 'src/common/enums/vendor/vendor.enum';

export class Vendor {
  vendorId: string;
  userId: string;
  storeName: string;
  slug: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  websiteUrl: string;
  phoneNumber: string;
  email: string;
  establishedDate: Date;
  status: VENDOR_STATUS;
  createdAt: Date;
  updatedAt: Date;

  static readonly #validator = z.object({
    userId: z.string().uuid(),
    storeName: z.string().min(1).max(100),
    slug: z
      .string()
      .min(1)
      .max(100)
      .regex(/^[a-z0-9-]+$/)
      .nullish(),
    description: z.string().max(1000).nullish(),
    logoUrl: z.string().url().max(255).nullish(),
    bannerUrl: z.string().url().max(255).nullish(),
    websiteUrl: z.string().url().max(255).nullish(),
    phoneNumber: z.string().max(20).nullish(),
    email: z.string().email().max(100),
    establishedDate: z.date().nullish(),
    status: z.nativeEnum(VENDOR_STATUS).default(VENDOR_STATUS.PENDING_APPROVAL),
  });

  static create(createVendorProps: CreateVendorProps) {
    return plainToInstance(Vendor, this.#validator.parse(createVendorProps), {
      exposeUnsetFields: false,
    });
  }

  static update(updateVendorProps: UpdateVendorProps) {
    return plainToInstance(
      Vendor,
      this.#validator.partial().parse(updateVendorProps),
      { exposeUnsetFields: false },
    );
  }

  static toDomain(vendor: Vendor) {
    return plainToInstance(Vendor, vendor, {
      exposeUnsetFields: false,
      enableImplicitConversion: true,
    });
  }

  static toDomains(vendors: Vendor[]) {
    return vendors?.map(this.toDomain);
  }
}
