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

@ApiBearerAuth()
@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewUseCase: ReviewUseCase) {}

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
  async reply(
    @Param('reviewId', ParseUUIDPipe) reviewId: string,
    @Body() dto: ReplyReviewDto,
  ): Promise<void> {
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
