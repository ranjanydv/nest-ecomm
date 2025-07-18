import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewEntity } from './review.entity';
import { ReviewRepository } from 'src/core/ports/out/review/review-repository.port';
import { Review } from 'src/core/domain/review/review.domain';
import {
  CreateReviewProps,
  UpdateReviewProps,
} from 'src/core/domain/review/review.types';
import { PaginationProps } from 'src/common/types/pagination.types';

function getSkipTake(filter: PaginationProps) {
  if (filter.pagination) {
    const skip = (filter.page - 1) * filter.size;
    const take = filter.size;
    return { skip, take };
  }
  return { skip: undefined, take: undefined };
}

@Injectable()
export class ReviewRepositoryImpl implements ReviewRepository {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
  ) {}

  async createReview(data: CreateReviewProps): Promise<Review> {
    return Review.toDomain(
      await this.reviewRepository.save(this.reviewRepository.create(data)),
    );
  }

  async updateReview(reviewId: string, data: UpdateReviewProps): Promise<void> {
    await this.reviewRepository.update({ reviewId }, data);
  }

  async approveReview(reviewId: string): Promise<void> {
    await this.reviewRepository.update({ reviewId }, { isApproved: true });
  }

  async replyToReview(reviewId: string, reply: string): Promise<void> {
    await this.reviewRepository.update(
      { reviewId },
      { reply, repliedAt: new Date() },
    );
  }

  async findReviewsByProduct(
    productId: string,
    filter: PaginationProps,
  ): Promise<[Review[], number]> {
    const { skip, take } = getSkipTake(filter);
    const [entities, count] = await this.reviewRepository.findAndCount({
      where: { productId, isApproved: true },
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
    return [entities.map(Review.toDomain), count];
  }

  async findReviewsByUser(
    userId: string,
    filter: PaginationProps,
  ): Promise<[Review[], number]> {
    const { skip, take } = getSkipTake(filter);
    const [entities, count] = await this.reviewRepository.findAndCount({
      where: { userId },
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
    return [entities.map(Review.toDomain), count];
  }

  async findReviewById(reviewId: string): Promise<Review> {
    return Review.toDomain(
      await this.reviewRepository.findOneOrFail({ where: { reviewId } }),
    );
  }
}
