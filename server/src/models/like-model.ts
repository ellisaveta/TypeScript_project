import { BaseModel } from "./base-model";

class LikeModel extends BaseModel {
    static readonly tableName = 'likes';
    userId!: number;
    movieId!: number;
}

export { LikeModel };