import { VENDOR_STATUS } from 'src/common/enums/vendor/vendor.enum';

export type CreateVendorProps = {
  userId: string;
  storeName: string;
  slug?: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  websiteUrl?: string;
  phoneNumber?: string;
  email: string;
  establishedDate?: Date;
  status?: VENDOR_STATUS;
};

export type UpdateVendorProps = Partial<CreateVendorProps>;
