import { ReviewModel } from "../models/review-model";
import { UserTransformer } from "./user-transformer";

export class ReviewTransformer {
  constructor(private userTransformer: UserTransformer) {}
  transform(review: ReviewModel) {
    return {
      id: review.id,
      user: review.user
        ? this.userTransformer.transform(review.user)
        : undefined,
      movieId: review.movieId,
      rating: review.rating,
      content: review.content,
    };
  }

  transformArray(reviews: ReviewModel[]) {
    return reviews.map((review) => this.transform(review));
  }
}
