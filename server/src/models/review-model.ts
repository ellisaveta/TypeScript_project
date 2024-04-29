import { Model } from "objection";
import { BaseModel } from "./base-model";
import { UserModel } from "./user-model";

export class ReviewModel extends BaseModel {
  static readonly tableName = "reviews";
  user?: UserModel;
  userId!: number;
  movieId!: number;
  rating!: number;
  content!: string | null;

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: "reviews.userId",
        to: "users.id",
      },
    },
  };
}
