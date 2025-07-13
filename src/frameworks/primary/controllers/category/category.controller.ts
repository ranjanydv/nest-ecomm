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
import { CategoryResponseDto } from '../../dto/response/category/category.dto';
import {
  CreateCategoryDto,
  QueryCategoryDto,
  UpdateCategoryDto,
} from '../../dto/request/category/category.dto';
import { CategoryUseCase } from 'src/core/ports/in/category/category-usecase.port';
import { Category } from 'src/core/domain/category/category.domain';
import { Privileges } from '../../decorators/privilege.decorator';
import { PRIVILEGE_SUBNAME } from 'src/common/enums/privilege/privilege.enum';
import { Transactional } from 'typeorm-transactional';

@ApiBearerAuth()
@ApiTags('Category')
@Controller('/category')
export class CategoryController {
  constructor(private readonly categoryUseCase: CategoryUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiPaginatedResponse(CategoryResponseDto)
  async findAll(@Query() queryCategoryDto: QueryCategoryDto) {
    const { page, size, parentCategoryId, status } = queryCategoryDto;

    const [categories, count] = await this.categoryUseCase.getAllCategories(
      { parentCategoryId, status },
      queryCategoryDto,
    );

    const data = categories.map(
      (category) => new CategoryResponseDto(category),
    );

    return new ResponseDto('Categories Fetched', data, {
      count,
      page,
      size,
    });
  }

  @Get(':categoryId')
  @ApiOperation({ summary: 'Get category by id' })
  @ApiCustomResponse(CategoryResponseDto)
  async findOne(@Param('categoryId', ParseUUIDPipe) categoryId: string) {
    return new ResponseDto(
      'Category Fetched',
      new CategoryResponseDto(
        await this.categoryUseCase.getCategoryById(categoryId),
      ),
    );
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get category by slug' })
  @ApiCustomResponse(CategoryResponseDto)
  async findBySlug(@Param('slug') slug: string) {
    return new ResponseDto(
      'Category Fetched',
      new CategoryResponseDto(
        await this.categoryUseCase.getCategoryBySlug(slug),
      ),
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create category' })
  @Privileges(PRIVILEGE_SUBNAME.CATEGORY_CREATE)
  @Transactional()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    await this.categoryUseCase.createCategory(
      Category.create(createCategoryDto),
    );

    return new ResponseDto('Category Created');
  }

  @Patch(':categoryId')
  @ApiOperation({ summary: 'Update category' })
  @Privileges(PRIVILEGE_SUBNAME.CATEGORY_UPDATE)
  @Transactional()
  async update(
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    await this.categoryUseCase.updateCategoryById(
      categoryId,
      updateCategoryDto,
    );

    return new ResponseDto('Category Updated');
  }
}
