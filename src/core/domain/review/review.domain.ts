import { z } from 'zod';
import { plainToInstance } from 'class-transformer';

export class Review {
  reviewId: string;
  productId: string;
  userId: string;
  rating: number;
  title?: string;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
  isApproved: boolean;
  reply?: string;
  repliedAt?: Date;

  static readonly #validator = z.object({
    productId: z.string().uuid(),
    userId: z.string().uuid(),
    rating: z.number().int().min(1).max(5),
    title: z.string().max(255).nullish(),
    comment: z.string().nullish(),
    isApproved: z.boolean().default(false),
    reply: z.string().nullish(),
    repliedAt: z.date().nullish(),
  });

  static create(props: Partial<Review>) {
    return plainToInstance(Review, this.#validator.parse(props), {
      exposeUnsetFields: false,
    });
  }

  static update(props: Partial<Review>) {
    return plainToInstance(Review, this.#validator.partial().parse(props), {
      exposeUnsetFields: false,
    });
  }

  static toDomain(review: Review) {
    return plainToInstance(Review, review, {
      exposeUnsetFields: false,
      enableImplicitConversion: true,
    });
  }
}
