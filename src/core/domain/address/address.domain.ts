import { z } from 'zod';
import { plainToInstance } from 'class-transformer';
import { CreateAddressProps, UpdateAddressProps } from './address.types';
import { ADDRESS_TYPE } from 'src/common/enums/address/address.enum';

export class Address {
  addressId: string;
  userId: string;
  vendorId: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  addressType: ADDRESS_TYPE;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;

  static readonly #validator = z.object({
    userId: z.string().uuid().nullish(),
    vendorId: z.string().uuid().nullish(),
    addressLine1: z.string().min(1).max(100),
    addressLine2: z.string().max(100).nullish(),
    city: z.string().min(1).max(50),
    stateProvince: z.string().min(1).max(50),
    postalCode: z.string().min(1).max(20),
    country: z.string().min(1).max(50),
    addressType: z.nativeEnum(ADDRESS_TYPE),
    isDefault: z.boolean().default(false),
  });

  static create(createAddressProps: CreateAddressProps) {
    return plainToInstance(Address, this.#validator.parse(createAddressProps), {
      exposeUnsetFields: false,
    });
  }

  static update(updateAddressProps: UpdateAddressProps) {
    return plainToInstance(
      Address,
      this.#validator.partial().parse(updateAddressProps),
      { exposeUnsetFields: false },
    );
  }

  static toDomain(address: Address) {
    return plainToInstance(Address, address, {
      exposeUnsetFields: false,
      enableImplicitConversion: true,
    });
  }

  static toDomains(addresses: Address[]) {
    return addresses?.map(this.toDomain);
  }
}
