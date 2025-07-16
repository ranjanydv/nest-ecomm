import { BadRequestException, Injectable } from '@nestjs/common';
import { PaginationProps } from 'src/common/types/pagination.types';
import { Address } from 'src/core/domain/address/address.domain';
import { AddressUseCase } from 'src/core/ports/in/address/address-usecase.port';
import { AddressRepository } from 'src/core/ports/out/address/address-repository.port';

@Injectable()
export class AddressUseCaseImpl implements AddressUseCase {
  constructor(private readonly addressRepository: AddressRepository) {}

  async getAllAddresses(
    options: Partial<Address>,
    filter: PaginationProps,
  ): Promise<[Address[], number]> {
    return await this.addressRepository.findAllAddresses([options], filter);
  }

  async getAddressById(addressId: Address['addressId']): Promise<Address> {
    await this.checkAddressExistsOrFail([{ addressId }]);
    return await this.addressRepository.findAddress({ addressId });
  }

  async createAddress(data: Address): Promise<Address> {
    return await this.addressRepository.createAddress(data);
  }

  async createBulkAddress(data: Address[]): Promise<Address[]> {
    return await this.addressRepository.createBulkAddress(data);
  }

  async updateAddressById(
    addressId: Address['addressId'],
    data: Partial<Address>,
  ): Promise<void> {
    await this.checkAddressExistsOrFail([{ addressId }]);
    return await this.addressRepository.updateAddress({ addressId }, data);
  }

  async checkAddressExistsOrFail(
    options: Partial<Address>[],
  ): Promise<boolean> {
    if (await this.addressRepository.addressExists(options)) return true;
    throw new BadRequestException('Address does not exist');
  }

  async countAddresses(options?: Partial<Address>): Promise<number> {
    return await this.addressRepository.countAddresses(options);
  }
}
