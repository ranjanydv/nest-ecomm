import { ApiProperty } from '@nestjs/swagger';
import { ADDRESS_TYPE } from 'src/common/enums/address/address.enum';

export class AddressResponseDto {
  @ApiProperty()
  addressId: string;

  @ApiProperty({ required: false })
  userId?: string;

  @ApiProperty({ required: false })
  vendorId?: string;

  @ApiProperty()
  addressLine1: string;

  @ApiProperty({ required: false })
  addressLine2?: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  stateProvince: string;

  @ApiProperty()
  postalCode: string;

  @ApiProperty()
  country: string;

  @ApiProperty({ enum: ADDRESS_TYPE })
  addressType: ADDRESS_TYPE;

  @ApiProperty()
  isDefault: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(data: AddressResponseDto) {
    Object.assign(this, data);
  }
}
