import { BadRequestException, Injectable } from '@nestjs/common';
import { PaginationProps } from 'src/common/types/pagination.types';
import { User } from 'src/core/domain/user/user.domain';
import { Vendor } from 'src/core/domain/vendor/vendor.domain';
import { RoleUseCase } from 'src/core/ports/in/role/role-usecase.port';
import { UserUseCase } from 'src/core/ports/in/user/user-usecase.port';
import { VendorUseCase } from 'src/core/ports/in/vendor/vendor-usecase.port';
import { VendorRepository } from 'src/core/ports/out/vendor/vendor-repository.port';
import { generateSlug, generateUniqueSlug } from 'src/utils/util.index';

@Injectable()
export class VendorUseCaseImpl implements VendorUseCase {
  constructor(
    private readonly vendorRepository: VendorRepository,
    private readonly userUseCase: UserUseCase,
    private readonly roleUseCase: RoleUseCase,
  ) {}

  async getAllVendors(
    options: Partial<Vendor>,
    filter: PaginationProps,
  ): Promise<[Vendor[], number]> {
    return await this.vendorRepository.findAllVendors([options], filter);
  }

  async getVendorById(vendorId: Vendor['vendorId']): Promise<Vendor> {
    await this.checkVendorExistsOrFail([{ vendorId }]);

    return await this.vendorRepository.findVendor({ vendorId });
  }

  async getVendorBySlug(slug: Vendor['slug']): Promise<Vendor> {
    await this.checkVendorExistsOrFail([{ slug }]);

    return await this.vendorRepository.findVendor({ slug });
  }

  async createVendor(data: Vendor): Promise<Vendor> {
    await this.userUseCase.checkUserExistsOrFail([{ userId: data.userId }]);

    // Generate unique slug if not provided
    if (!data.slug) {
      const baseSlug = generateSlug(data.storeName);
      data.slug = await generateUniqueSlug(baseSlug, (slug: string) =>
        this.vendorRepository.slugExists(slug),
      );
    }

    return await this.vendorRepository.createVendor(data);
  }

  async createBulkVendor(data: Vendor[]): Promise<Vendor[]> {
    await this.userUseCase.checkUserExistsOrFail(
      data?.map(({ userId }) => ({ userId })),
    );

    return await this.vendorRepository.createBulkVendor(data);
  }

  async updateVendorById(
    vendorId: Vendor['vendorId'],
    data: Partial<Vendor>,
  ): Promise<void> {
    await this.checkVendorExistsOrFail([{ vendorId }]);

    if (data.userId) {
      await this.userUseCase.checkUserExistsOrFail([{ userId: data.userId }]);
    }

    return await this.vendorRepository.updateVendor({ vendorId }, data);
  }

  async checkVendorExistsOrFail(options: Partial<Vendor>[]): Promise<boolean> {
    if (await this.vendorRepository.vendorExists(options)) return true;

    throw new BadRequestException('Vendor does not exist');
  }

  async countVendors(options?: Partial<Vendor>): Promise<number> {
    return await this.vendorRepository.countVendors(options);
  }

  async registerVendor(
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
  ): Promise<{ user: any; vendor: Vendor }> {
    // Get VENDOR role
    const [vendorRoles] = await this.roleUseCase.getAllRoles(
      { roleName: 'VENDOR' },
      { pagination: false },
    );

    if (!vendorRoles || vendorRoles.length === 0) {
      throw new BadRequestException(
        'VENDOR role not found. Please run seeders first.',
      );
    }

    // Create user with VENDOR role
    const user = await this.userUseCase.createUser(
      User.create({
        ...userData,
        role: vendorRoles[0],
      }),
    );

    // Create vendor with the new user ID
    const vendor = await this.createVendor(
      Vendor.create({
        ...vendorData,
        userId: user.userId,
        email: user.email,
      }),
    );

    return { user, vendor };
  }
}
