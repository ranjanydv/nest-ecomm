import { BadRequestException, Injectable } from '@nestjs/common';
import { ReviewUseCase } from 'src/core/ports/in/review/review-usecase.port';
import { ReviewRepository } from 'src/core/ports/out/review/review-repository.port';
import { ProductUseCase } from 'src/core/ports/in/product/product-usecase.port';
import { OrderUseCase } from 'src/core/ports/in/order/order-usecase.port';
import { Review } from 'src/core/domain/review/review.domain';
import {
  CreateReviewProps,
  UpdateReviewProps,
} from 'src/core/domain/review/review.types';
import { PaginationProps } from 'src/common/types/pagination.types';

@Injectable()
export class ReviewUseCaseImpl implements ReviewUseCase {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly productUseCase: ProductUseCase,
    private readonly orderUseCase: OrderUseCase,
  ) {}

  async createReview(data: CreateReviewProps): Promise<Review> {
    // Check if product exists
    await this.productUseCase.checkProductExistsOrFail([
      { productId: data.productId },
    ]);
    // Check if user has purchased the product
    const hasPurchased = await this.orderUseCase.userHasPurchasedProduct(
      data.userId,
      data.productId,
    );
    if (!hasPurchased) {
      throw new BadRequestException('User has not purchased this product');
    }
    return this.reviewRepository.createReview(data);
  }

  async updateReview(reviewId: string, data: UpdateReviewProps): Promise<void> {
    await this.reviewRepository.updateReview(reviewId, data);
  }

  async approveReview(reviewId: string): Promise<void> {
    await this.reviewRepository.approveReview(reviewId);
  }

  async replyToReview(reviewId: string, reply: string): Promise<void> {
    await this.reviewRepository.replyToReview(reviewId, reply);
  }

  async getReviewsByProduct(
    productId: string,
    filter: PaginationProps,
  ): Promise<[Review[], number]> {
    return this.reviewRepository.findReviewsByProduct(productId, filter);
  }

  async getReviewsByUser(
    userId: string,
    filter: PaginationProps,
  ): Promise<[Review[], number]> {
    return this.reviewRepository.findReviewsByUser(userId, filter);
  }

  async getReviewById(reviewId: string): Promise<Review> {
    return this.reviewRepository.findReviewById(reviewId);
  }
}
