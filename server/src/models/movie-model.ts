import { Model } from "objection";
import { BaseModel } from "./base-model";
import { CommentModel } from "./comment-model";
import { ReviewModel } from "./review-model";
import { UserModel } from "./user-model";

class MovieModel extends BaseModel {
  static readonly tableName = "movies";
  title!: string;
  director!: string | null;
  mainStar!: number | null;
  description!: string | null;
  releaseDate!: Date | null;
  poster!: string | null;
  likedBy?: UserModel[];
  comments?: CommentModel[];
  reviews?: ReviewModel[];

  static relationMappings = {
    likedBy: {
      relation: Model.ManyToManyRelation,
      modelClass: UserModel,
      join: {
        from: "movies.id",
        through: {
          from: "likes.movieId",
          to: "likes.userId",
        },
        to: "users.id",
      },
    },

    comments: {
      relation: Model.HasManyRelation,
      modelClass: CommentModel,
      join: {
        from: "movies.id",
        to: "comments.movieId",
      },
    },

    reviews: {
      relation: Model.HasManyRelation,
      modelClass: ReviewModel,
      join: {
        from: "movies.id",
        to: "reviews.movieId",
      },
    },
  };
}

export { MovieModel };
