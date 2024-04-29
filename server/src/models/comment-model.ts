import { Model } from "objection";
import { BaseModel } from "./base-model";
import { UserModel } from "./user-model";

export class CommentModel extends BaseModel {
  static readonly tableName = "comments";
  user?: UserModel;
  userId!: number;
  movieId!: number;
  content!: string;

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: "comments.userId",
        to: "users.id",
      },
    },
  };
}
