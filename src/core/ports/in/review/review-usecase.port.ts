import { PaginationProps } from 'src/common/types/pagination.types';
import { Review } from '../../../domain/review/review.domain';
import {
  CreateReviewProps,
  UpdateReviewProps,
} from '../../../domain/review/review.types';

export abstract class ReviewUseCase {
  abstract createReview(data: CreateReviewProps): Promise<Review>;
  abstract updateReview(
    reviewId: string,
    data: UpdateReviewProps,
  ): Promise<void>;
  abstract approveReview(reviewId: string): Promise<void>;
  abstract replyToReview(reviewId: string, reply: string): Promise<void>;
  abstract getReviewsByProduct(
    productId: string,
    filter: PaginationProps,
  ): Promise<[Review[], number]>;
  abstract getReviewsByUser(
    userId: string,
    filter: PaginationProps,
  ): Promise<[Review[], number]>;
  abstract getReviewById(reviewId: string): Promise<Review>;
}
