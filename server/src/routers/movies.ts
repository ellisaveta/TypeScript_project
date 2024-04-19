import { Router } from "express";
import { NotFoundError } from "../errors";
import { findUserWithThatId } from "./users";
import {
  authMiddleware,
  userIdFromLocals,
} from "../middlewares/auth-middleware";
import {
  requestHandler,
  ResponseWithCode,
} from "../middlewares/request-handler";
import {
  AddMovieInputSchema,
  ModifyMovieInputSchema,
  MovieService,
} from "../services/movie-service";
import { LikeService } from "../services/like-service";
import { CommentService } from "../services/comment-service";
import {
  AddReviewInputSchema,
  ReviewService,
} from "../services/review-service";
import { MovieTransformer } from "../transformers/movie-transformer";
import { UserTransformer } from "../transformers/user-transformer";

import { number, z } from "zod";
import { CommentTransformer } from "../transformers/comment-transformer";
import { ReviewTransformer } from "../transformers/review-transformer";
import { LikeModel } from "../models/like-model";
import { adminMiddleware } from "../middlewares/admin-middleware";

const movieRouter = Router();
const movieService = new MovieService();
const likeService = new LikeService();
const commentService = new CommentService();
const reviewService = new ReviewService();
const movieTransformer = new MovieTransformer(
  new UserTransformer(),
  new CommentTransformer(new UserTransformer()),
  new ReviewTransformer(new UserTransformer())
);

const IdInputSchema = z.object({
  id: z.preprocess((value) => Number(value), z.number().positive()),
});

const GetMoviesInputSchema = z.object({
  page: z.preprocess((value) => Number(value ?? 1), z.number().positive()),
  size: z.preprocess((value) => Number(value ?? 10), z.number().positive()),
  searchText: z.string().optional(),
});

const CommentInputSchema = z.object({
  content: z.string().min(1),
});

export async function findMovieWithThatId(id: number) {
  const movie = await movieService.getMovieById(id);

  if (!movie) {
    throw new NotFoundError(`There is no movie with id: ${id}`);
  }

  return movie;
}

movieRouter.get(
  "/",
  authMiddleware,
  requestHandler(async (req) => {
    const { page, size, searchText } = GetMoviesInputSchema.parse(req.query);
    const { results, total } = await movieService.listAllMovies(
      page,
      size,
      searchText
    );
    return { movies: movieTransformer.transformArray(results), total };
  })
);

movieRouter.get(
  "/rating",
  authMiddleware,
  requestHandler(async (req) => {
    const { page, size } = GetMoviesInputSchema.parse(req.query);
    const { results, total } = await movieService.moviesOrderedByAverageRating(
      page,
      size
    );
    return { movies: movieTransformer.transformArray(results), total };
  })
);

movieRouter.get(
  "/:id",
  authMiddleware,
  requestHandler(async (req) => {
    const { id } = IdInputSchema.parse(req.params);

    const getMovie = await findMovieWithThatId(id);
    return { movie: movieTransformer.transform(getMovie) };
  })
);

movieRouter.get(
  "/:id/likes",
  authMiddleware,
  requestHandler(async (req) => {
    const { id } = IdInputSchema.parse(req.params);
    const getMovie = await movieService.getMovieWithLikes(id);

    if (!getMovie) {
      throw new NotFoundError(`There is no movie with id: ${id}`);
    }

    return { movie: movieTransformer.transform(getMovie) };
  })
);

movieRouter.get(
  "/:id/comments",
  authMiddleware,
  requestHandler(async (req) => {
    const { id } = IdInputSchema.parse(req.params);
    const getMovie = await movieService.getMovieWithComments(id);
    if (!getMovie) {
      throw new NotFoundError(`There is no movie with id: ${id}`);
    }

    return { movie: movieTransformer.transform(getMovie) };
  })
);

movieRouter.get(
  "/:id/reviews",
  authMiddleware,
  requestHandler(async (req) => {
    const { id } = IdInputSchema.parse(req.params);
    const getMovie = await movieService.getMovieWithReviews(id);

    if (!getMovie) {
      throw new NotFoundError(`There is no movie with id: ${id}`);
    }

    return { movie: movieTransformer.transform(getMovie) };
  })
);

movieRouter.get(
  "/:id/info",
  authMiddleware,
  requestHandler(async (req) => {
    const { id } = IdInputSchema.parse(req.params);
    const getMovie = await movieService.getMovieWithInfo(id);

    if (!getMovie) {
      throw new NotFoundError(`There is no movie with id: ${id}`);
    }

    return { movie: movieTransformer.transform(getMovie) };
  })
);

movieRouter.post(
  "/",
  authMiddleware,
  adminMiddleware,
  requestHandler(async (req) => {
    const input = AddMovieInputSchema.parse(req.body);
    const movie = await movieService.add(input);

    return new ResponseWithCode(201, movieTransformer.transform(movie));
  })
);

movieRouter.post(
  "/:id/like",
  authMiddleware,
  requestHandler(async (req, res) => {
    const { id: movieId } = IdInputSchema.parse(req.params);
    await findMovieWithThatId(movieId);
    const userId = userIdFromLocals(res);
    await findUserWithThatId(userId); // maybe unnecessary but for double-check

    const like = await likeService.likeOrUnLike(userId, movieId);

    return like instanceof LikeModel ? new ResponseWithCode(201, like) : {};
  })
);

movieRouter.post(
  "/:id/comment",
  authMiddleware,
  requestHandler(async (req, res) => {
    const { id: movieId } = IdInputSchema.parse(req.params);
    const { content } = CommentInputSchema.parse(req.body);
    await findMovieWithThatId(movieId);
    const userId = userIdFromLocals(res);
    await findUserWithThatId(userId); // maybe unnecessary but for double-check

    const comment = await commentService.add(userId, movieId, content);
    return new ResponseWithCode(201, comment);
  })
);

movieRouter.post(
  "/:id/review",
  authMiddleware,
  requestHandler(async (req, res) => {
    const { id: movieId } = IdInputSchema.parse(req.params);
    const input = AddReviewInputSchema.parse(req.body);
    await findMovieWithThatId(movieId);
    const userId = userIdFromLocals(res);
    await findUserWithThatId(userId); // maybe unnecessary but for double-check

    const review = await reviewService.add(userId, movieId, input);
    return new ResponseWithCode(201, review);
  })
);

movieRouter.patch(
  "/:id",
  authMiddleware,
  adminMiddleware,
  requestHandler(async (req) => {
    const { id } = IdInputSchema.parse(req.params);
    const input = ModifyMovieInputSchema.parse(req.body);
    await findMovieWithThatId(id);

    const modifiedMovie = await movieService.update(id, input);

    if (!modifiedMovie) {
      throw new NotFoundError(
        `Nothing was modified! There is no movie with id: ${id}!`
      );
    }

    return { movie: movieTransformer.transform(modifiedMovie) };
  })
);

movieRouter.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  requestHandler(async (req) => {
    const { id } = IdInputSchema.parse(req.params);
    await findMovieWithThatId(id);

    const deletedMovie = await movieService.deleteById(id);
    return { deletedMovie };
  })
);

export { movieRouter };
