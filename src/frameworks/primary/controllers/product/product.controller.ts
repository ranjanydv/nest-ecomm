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
import { ProductResponseDto } from '../../dto/response/product/product.dto';
import {
  CreateProductDto,
  QueryProductDto,
  UpdateProductDto,
} from '../../dto/request/product/product.dto';
import { ProductUseCase } from 'src/core/ports/in/product/product-usecase.port';
import { Product } from 'src/core/domain/product/product.domain';
import { Privileges } from '../../decorators/privilege.decorator';
import { PRIVILEGE_SUBNAME } from 'src/common/enums/privilege/privilege.enum';
import { Transactional } from 'typeorm-transactional';

@ApiBearerAuth()
@ApiTags('Product')
@Controller('/product')
export class ProductController {
  constructor(private readonly productUseCase: ProductUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiPaginatedResponse(ProductResponseDto)
  async findAll(@Query() queryProductDto: QueryProductDto) {
    const { page, size, vendorId, status, isFeatured } = queryProductDto;

    const [products, count] = await this.productUseCase.getAllProducts(
      { vendorId, status, isFeatured },
      queryProductDto,
    );

    const data = products.map((product) => new ProductResponseDto(product));

    return new ResponseDto('Products Fetched', data, {
      count,
      page,
      size,
    });
  }

  @Get(':productId')
  @ApiOperation({ summary: 'Get product by id' })
  @ApiCustomResponse(ProductResponseDto)
  async findOne(@Param('productId', ParseUUIDPipe) productId: string) {
    return new ResponseDto(
      'Product Fetched',
      new ProductResponseDto(
        await this.productUseCase.getProductById(productId),
      ),
    );
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get product by slug' })
  @ApiCustomResponse(ProductResponseDto)
  async findBySlug(@Param('slug') slug: string) {
    return new ResponseDto(
      'Product Fetched',
      new ProductResponseDto(await this.productUseCase.getProductBySlug(slug)),
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create product' })
  @Privileges(PRIVILEGE_SUBNAME.PRODUCT_CREATE)
  @Transactional()
  async create(@Body() createProductDto: CreateProductDto) {
    await this.productUseCase.createProduct(Product.create(createProductDto));

    return new ResponseDto('Product Created');
  }

  @Patch(':productId')
  @ApiOperation({ summary: 'Update product' })
  @Privileges(PRIVILEGE_SUBNAME.PRODUCT_UPDATE)
  @Transactional()
  async update(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    await this.productUseCase.updateProductById(productId, updateProductDto);

    return new ResponseDto('Product Updated');
  }
}
