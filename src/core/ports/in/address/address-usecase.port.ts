import { PaginationProps } from 'src/common/types/pagination.types';
import { Address } from '../../../domain/address/address.domain';

export abstract class AddressUseCase {
  abstract getAllAddresses(
    options: Partial<Address>,
    filter: PaginationProps,
  ): Promise<[Address[], number]>;

  abstract getAddressById(id: Address['addressId']): Promise<Address>;

  abstract createAddress(data: Address): Promise<Address>;

  abstract createBulkAddress(data: Address[]): Promise<Address[]>;

  abstract updateAddressById(
    id: Address['addressId'],
    data: Partial<Address>,
  ): Promise<void>;

  abstract checkAddressExistsOrFail(
    options: Partial<Address>[],
  ): Promise<boolean | never>;

  abstract countAddresses(options?: Partial<Address>): Promise<number>;
}
