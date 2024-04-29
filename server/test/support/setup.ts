import knex from "knex";
import { Model } from "objection";
import knexConfig from "../../knexfile";
import { CommentModel } from "../../src/models/comment-model";
import { LikeModel } from "../../src/models/like-model";
import { MovieModel } from "../../src/models/movie-model";
import { ReviewModel } from "../../src/models/review-model";
import { UserModel } from "../../src/models/user-model";

const knexClient = knex(knexConfig.test);

beforeAll(async () => {
  Model.knex(knexClient);

  await knexClient.migrate.latest();
});

beforeEach(async () => {
  await CommentModel.query().delete();
  await LikeModel.query().delete();
  await MovieModel.query().delete();
  await ReviewModel.query().delete();
  await UserModel.query().delete();
});

afterAll(async () => await knexClient.destroy());
