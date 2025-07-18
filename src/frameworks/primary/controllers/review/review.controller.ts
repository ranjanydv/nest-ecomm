import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReviewUseCase } from 'src/core/ports/in/review/review-usecase.port';
import {
  CreateReviewDto,
  UpdateReviewDto,
  ReplyReviewDto,
} from '../../dto/request/review/review.dto';
import { ReviewResponseDto } from '../../dto/response/review/review.dto';
import { plainToInstance } from 'class-transformer';
import { Privileges } from '../../decorators/privilege.decorator';
import { PRIVILEGE_SUBNAME } from 'src/common/enums/privilege/privilege.enum';
import { ForbiddenException } from '@nestjs/common';
import { ProductUseCase } from 'src/core/ports/in/product/product-usecase.port';
import { AuthUser } from '../../decorators/user.decorator';
import { User } from 'src/core/domain/user/user.domain';
import { VendorUseCase } from 'src/core/ports/in/vendor/vendor-usecase.port';

@ApiBearerAuth()
@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
  constructor(
    private readonly reviewUseCase: ReviewUseCase,
    private readonly productUseCase: ProductUseCase,
    private readonly vendorUseCase: VendorUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a review (only after purchase)' })
  async create(@Body() dto: CreateReviewDto): Promise<ReviewResponseDto> {
    const review = await this.reviewUseCase.createReview(dto);
    return plainToInstance(ReviewResponseDto, review);
  }

  @Patch(':reviewId')
  @ApiOperation({ summary: 'Update a review' })
  async update(
    @Param('reviewId', ParseUUIDPipe) reviewId: string,
    @Body() dto: UpdateReviewDto,
  ): Promise<void> {
    await this.reviewUseCase.updateReview(reviewId, dto);
  }

  @Patch(':reviewId/approve')
  @ApiOperation({ summary: 'Approve a review (moderation)' })
  @Privileges(PRIVILEGE_SUBNAME.REVIEW_APPROVE)
  async approve(
    @Param('reviewId', ParseUUIDPipe) reviewId: string,
  ): Promise<void> {
    await this.reviewUseCase.approveReview(reviewId);
  }

  @Patch(':reviewId/reply')
  @ApiOperation({ summary: 'Vendor reply to a review' })
  @Privileges(PRIVILEGE_SUBNAME.REVIEW_REPLY)
  async reply(
    @Param('reviewId', ParseUUIDPipe) reviewId: string,
    @Body() dto: ReplyReviewDto,
    @AuthUser() user: User,
  ): Promise<void> {
    // 1. Get the review
    const review = await this.reviewUseCase.getReviewById(reviewId);
    // 2. Get the product
    const product = await this.productUseCase.getProductById(review.productId);
    // 3. Check if the current user is the vendor of the product
    const vendor = await this.vendorUseCase.getVendorById(product.vendorId);

    if (vendor.userId !== user.userId) {
      throw new ForbiddenException(
        'Only the vendor of this product can reply to reviews.',
      );
    }
    // 4. Allow reply
    await this.reviewUseCase.replyToReview(reviewId, dto.reply);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get reviews for a product' })
  async getByProduct(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Query() filter: any,
  ): Promise<{ data: ReviewResponseDto[]; total: number }> {
    const [reviews, total] = await this.reviewUseCase.getReviewsByProduct(
      productId,
      filter,
    );
    return {
      data: reviews.map((r) => plainToInstance(ReviewResponseDto, r)),
      total,
    };
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get reviews by a user' })
  async getByUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() filter: any,
  ): Promise<{ data: ReviewResponseDto[]; total: number }> {
    const [reviews, total] = await this.reviewUseCase.getReviewsByUser(
      userId,
      filter,
    );
    return {
      data: reviews.map((r) => plainToInstance(ReviewResponseDto, r)),
      total,
    };
  }

  @Get(':reviewId')
  @ApiOperation({ summary: 'Get a review by ID' })
  async getById(
    @Param('reviewId', ParseUUIDPipe) reviewId: string,
  ): Promise<ReviewResponseDto> {
    const review = await this.reviewUseCase.getReviewById(reviewId);
    return plainToInstance(ReviewResponseDto, review);
  }
}
