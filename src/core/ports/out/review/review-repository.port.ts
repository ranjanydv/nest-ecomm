import { Review } from 'src/core/domain/review/review.domain';
import { PaginationProps } from 'src/common/types/pagination.types';
import {
  CreateReviewProps,
  UpdateReviewProps,
} from 'src/core/domain/review/review.types';

export abstract class ReviewRepository {
  abstract createReview(data: CreateReviewProps): Promise<Review>;
  abstract updateReview(
    reviewId: string,
    data: UpdateReviewProps,
  ): Promise<void>;
  abstract approveReview(reviewId: string): Promise<void>;
  abstract replyToReview(reviewId: string, reply: string): Promise<void>;
  abstract findReviewsByProduct(
    productId: string,
    filter: PaginationProps,
  ): Promise<[Review[], number]>;
  abstract findReviewsByUser(
    userId: string,
    filter: PaginationProps,
  ): Promise<[Review[], number]>;
  abstract findReviewById(reviewId: string): Promise<Review>;
}
