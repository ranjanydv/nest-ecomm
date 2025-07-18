export type CreateReviewProps = {
  productId: string;
  userId: string;
  rating: number;
  title?: string;
  comment?: string;
};

export type UpdateReviewProps = Partial<CreateReviewProps> & {
  isApproved?: boolean;
  reply?: string;
  repliedAt?: Date;
};
