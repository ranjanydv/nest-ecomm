import { Address } from 'src/core/domain/address/address.domain';
import { PaginationProps } from 'src/common/types/pagination.types';

export abstract class AddressRepository {
  abstract findAllAddresses(
    options: Partial<Address>[],
    filter: PaginationProps,
  ): Promise<[Address[], number]>;

  abstract findAddress(options: Partial<Address>): Promise<Address>;

  abstract createAddress(data: Address): Promise<Address>;

  abstract createBulkAddress(data: Address[]): Promise<Address[]>;

  abstract updateAddress(
    options: Pick<Address, 'addressId'>,
    data: Partial<Address>,
  ): Promise<void>;

  abstract saveAddress(data: Address): Promise<Address>;

  abstract countAddresses(options: Partial<Address>): Promise<number>;

  abstract addressExists(options: Partial<Address>[]): Promise<boolean>;
}
