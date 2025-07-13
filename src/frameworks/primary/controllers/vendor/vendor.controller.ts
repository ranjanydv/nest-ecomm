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
import { VendorResponseDto } from '../../dto/response/vendor/vendor.dto';
import {
  CreateVendorDto,
  QueryVendorDto,
  UpdateVendorDto,
  VendorRegistrationDto,
} from '../../dto/request/vendor/vendor.dto';
import { VendorUseCase } from 'src/core/ports/in/vendor/vendor-usecase.port';
import { Vendor } from 'src/core/domain/vendor/vendor.domain';
import { Privileges } from '../../decorators/privilege.decorator';
import { PRIVILEGE_SUBNAME } from 'src/common/enums/privilege/privilege.enum';
import { Transactional } from 'typeorm-transactional';
import { Public } from '../../decorators/public.decorator';

@ApiBearerAuth()
@ApiTags('Vendor')
@Controller('/vendor')
export class VendorController {
  constructor(private readonly vendorUseCase: VendorUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Get all vendors' })
  @ApiPaginatedResponse(VendorResponseDto)
  async findAll(@Query() queryVendorDto: QueryVendorDto) {
    const { page, size, userId, status } = queryVendorDto;

    const [vendors, count] = await this.vendorUseCase.getAllVendors(
      { userId, status },
      queryVendorDto,
    );

    const data = vendors.map((vendor) => new VendorResponseDto(vendor));

    return new ResponseDto('Vendors Fetched', data, {
      count,
      page,
      size,
    });
  }

  @Get(':vendorId')
  @ApiOperation({ summary: 'Get vendor by id' })
  @ApiCustomResponse(VendorResponseDto)
  async findOne(@Param('vendorId', ParseUUIDPipe) vendorId: string) {
    return new ResponseDto(
      'Vendor Fetched',
      new VendorResponseDto(await this.vendorUseCase.getVendorById(vendorId)),
    );
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get vendor by slug' })
  @ApiCustomResponse(VendorResponseDto)
  async findBySlug(@Param('slug') slug: string) {
    return new ResponseDto(
      'Vendor Fetched',
      new VendorResponseDto(await this.vendorUseCase.getVendorBySlug(slug)),
    );
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register as vendor' })
  @Transactional()
  async register(@Body() registrationDto: VendorRegistrationDto) {
    const { establishedDate, ...vendorData } = registrationDto;

    const result = await this.vendorUseCase.registerVendor(
      {
        userName: registrationDto.userName,
        email: registrationDto.email,
        password: registrationDto.password,
        phone: registrationDto.phone,
        image: registrationDto.image,
      },
      {
        ...vendorData,
        establishedDate: establishedDate
          ? new Date(establishedDate)
          : undefined,
      },
    );

    return new ResponseDto('Vendor Registration Successful', {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      user: result.user,
      vendor: new VendorResponseDto(result.vendor),
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create vendor' })
  @Privileges(PRIVILEGE_SUBNAME.VENDOR_UPDATE)
  @Transactional()
  async create(@Body() createVendorDto: CreateVendorDto) {
    const vendorData = {
      ...createVendorDto,
      establishedDate: createVendorDto.establishedDate
        ? new Date(createVendorDto.establishedDate)
        : undefined,
    };

    await this.vendorUseCase.createVendor(Vendor.create(vendorData));

    return new ResponseDto('Vendor Created');
  }

  @Patch(':vendorId')
  @ApiOperation({ summary: 'Update vendor' })
  @Privileges(PRIVILEGE_SUBNAME.VENDOR_UPDATE)
  @Transactional()
  async update(
    @Param('vendorId', ParseUUIDPipe) vendorId: string,
    @Body() updateVendorDto: UpdateVendorDto,
  ) {
    const vendorData = {
      ...updateVendorDto,
      establishedDate: updateVendorDto.establishedDate
        ? new Date(updateVendorDto.establishedDate)
        : undefined,
    };

    await this.vendorUseCase.updateVendorById(vendorId, vendorData);

    return new ResponseDto('Vendor Updated');
  }
}
