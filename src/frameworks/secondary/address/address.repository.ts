import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { AddressEntity } from './address.entity';
import { PaginationProps } from 'src/common/types/pagination.types';
import { Address } from 'src/core/domain/address/address.domain';
import { AddressRepository } from 'src/core/ports/out/address/address-repository.port';
import { getPaginationSortParams } from 'src/utils/util.index';

@Injectable()
export class AddressRepositoryImpl implements AddressRepository {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
  ) {}

  async findAllAddresses(
    options: Partial<Address>[],
    filter: PaginationProps,
  ): Promise<[Address[], number]> {
    const baseCondition = (options: Partial<Address>) => [
      { addressLine1: ILike(`%${filter?.search || ''}%`), ...options },
      { city: ILike(`%${filter?.search || ''}%`), ...options },
      { country: ILike(`%${filter?.search || ''}%`), ...options },
    ];

    const condition: FindOptionsWhere<Address>[] = options?.flatMap((opt) =>
      baseCondition(opt),
    );

    const addresses = await this.addressRepository.find({
      where: condition,
      relations: {
        user: true,
        vendor: true,
      },
      ...getPaginationSortParams(filter),
    });

    const count = await this.addressRepository.count({ where: condition });

    return [Address.toDomains(addresses), count] as [Address[], number];
  }

  async findAddress(options: Partial<Address>): Promise<Address> {
    return Address.toDomain(
      await this.addressRepository.findOneOrFail({
        where: options,
        relations: {
          user: true,
          vendor: true,
        },
      }),
    );
  }

  async createAddress(data: Address): Promise<Address> {
    return Address.toDomain(
      await this.addressRepository.save(this.addressRepository.create(data)),
    );
  }

  async createBulkAddress(data: Address[]): Promise<Address[]> {
    return Address.toDomains(
      await this.addressRepository.save(this.addressRepository.create(data)),
    );
  }

  async updateAddress(
    options: Pick<Address, 'addressId'>,
    data: Partial<Address>,
  ): Promise<void> {
    await this.addressRepository.update(options, data);
  }

  async saveAddress(data: Address): Promise<Address> {
    return Address.toDomain(await this.addressRepository.save(data));
  }

  async addressExists(options: Partial<Address>[]): Promise<boolean> {
    return await this.addressRepository.existsBy(options);
  }

  async countAddresses(options: Partial<Address>): Promise<number> {
    return await this.addressRepository.countBy(options);
  }
}
