import { UniqueViolationError } from "objection";
import { LikeModel } from "../models/like-model";

export class LikeService {
  async likeOrUnLike(userId: number, movieId: number) {
    try {
      return await LikeModel.query().insertAndFetch({ userId, movieId });
    } catch (err) {
      //If a like already exists then the request will remove it.
      //When you click "Like" button second time, it works like "unlike" button.
      if (
        err instanceof UniqueViolationError &&
        err.constraint === "likes_user_id_movie_id_unique"
      ) {
        await LikeModel.query().delete().findOne({ userId, movieId });
        return;
      }
      throw err;
    }
  }

  async getLikeId(userId: number, movieId: number) {
    const like = await LikeModel.query().findOne({ userId, movieId });
    return like?.id;
  }

  async deleteById(id: number) {
    return await LikeModel.query().deleteById(id);
  }

  async getLikeById(id: number) {
    return await LikeModel.query().findById(id);
  }
}
