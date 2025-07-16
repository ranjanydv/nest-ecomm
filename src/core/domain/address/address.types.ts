import { ADDRESS_TYPE } from 'src/common/enums/address/address.enum';

export type CreateAddressProps = {
  userId?: string;
  vendorId?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  addressType: ADDRESS_TYPE;
  isDefault?: boolean;
};

export type UpdateAddressProps = Partial<CreateAddressProps>;
