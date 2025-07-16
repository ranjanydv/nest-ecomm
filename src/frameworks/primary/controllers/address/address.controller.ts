import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiCustomResponse,
  ApiPaginatedResponse,
  ResponseDto,
} from '../../dto/response/response.dto';
import { AddressResponseDto } from '../../dto/response/address/address.dto';
import {
  CreateAddressDto,
  QueryAddressDto,
  UpdateAddressDto,
} from '../../dto/request/address/address.dto';
import { AddressUseCase } from 'src/core/ports/in/address/address-usecase.port';
import { Address } from 'src/core/domain/address/address.domain';
import { Transactional } from 'typeorm-transactional';

@ApiBearerAuth()
@ApiTags('Address')
@Controller('/address')
export class AddressController {
  constructor(private readonly addressUseCase: AddressUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Get all addresses' })
  @ApiPaginatedResponse(AddressResponseDto)
  async findAll(@Query() queryAddressDto: QueryAddressDto) {
    const { page, size, userId, vendorId, addressType } = queryAddressDto;

    const [addresses, count] = await this.addressUseCase.getAllAddresses(
      { userId, vendorId, addressType },
      queryAddressDto,
    );

    const data = addresses.map((address) => new AddressResponseDto(address));

    return new ResponseDto('Addresses Fetched', data, {
      count,
      page,
      size,
    });
  }

  @Get(':addressId')
  @ApiOperation({ summary: 'Get address by id' })
  @ApiCustomResponse(AddressResponseDto)
  async findOne(@Param('addressId', ParseUUIDPipe) addressId: string) {
    return new ResponseDto(
      'Address Fetched',
      new AddressResponseDto(
        await this.addressUseCase.getAddressById(addressId),
      ),
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create address' })
  @Transactional()
  async create(@Body() createAddressDto: CreateAddressDto) {
    await this.addressUseCase.createAddress(Address.create(createAddressDto));
    return new ResponseDto('Address Created');
  }

  @Patch(':addressId')
  @ApiOperation({ summary: 'Update address' })
  @Transactional()
  async update(
    @Param('addressId', ParseUUIDPipe) addressId: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    await this.addressUseCase.updateAddressById(addressId, updateAddressDto);
    return new ResponseDto('Address Updated');
  }
}
