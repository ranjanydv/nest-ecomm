import { ApiProperty } from '@nestjs/swagger';
import { VENDOR_STATUS } from 'src/common/enums/vendor/vendor.enum';

class VendorUserDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  email: string;

  constructor({ userId, userName, email }: VendorUserDto) {
    Object.assign(this, { userId, userName, email });
  }
}

export class VendorResponseDto {
  @ApiProperty()
  vendorId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  storeName: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  logoUrl: string;

  @ApiProperty()
  bannerUrl: string;

  @ApiProperty()
  websiteUrl: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  establishedDate: Date;

  @ApiProperty({ enum: VENDOR_STATUS })
  status: VENDOR_STATUS;

  @ApiProperty({ type: VendorUserDto, required: false })
  user?: VendorUserDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor({
    vendorId,
    userId,
    storeName,
    slug,
    description,
    logoUrl,
    bannerUrl,
    websiteUrl,
    phoneNumber,
    email,
    establishedDate,
    status,
    user,
    createdAt,
    updatedAt,
  }: VendorResponseDto) {
    Object.assign(this, {
      vendorId,
      userId,
      storeName,
      slug,
      description,
      logoUrl,
      bannerUrl,
      websiteUrl,
      phoneNumber,
      email,
      establishedDate,
      status,
      createdAt,
      updatedAt,
    });

    this.user = user ? new VendorUserDto(user) : undefined;
  }
}
