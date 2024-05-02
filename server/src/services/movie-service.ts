import { MovieModel } from "../models/movie-model";
import { z } from "zod";

export const AddMovieInputSchema = z.object({
  title: z.string({ required_error: "Title is required!" }),
  director: z.string().min(2).optional(),
  mainStar: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  releaseDate: z.preprocess((value) => {
    if (typeof value === "string" || value instanceof Date)
      return new Date(value);
  }, z.date().optional()),
  poster: z.string().max(255).optional(),
});

type AddMovieInput = z.infer<typeof AddMovieInputSchema>;

export const ModifyMovieInputSchema = z.object({
  title: z.string().optional(),
  director: z.string().min(2).optional(),
  mainStar: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  releaseDate: z.preprocess((value) => {
    if (typeof value === "string" || value instanceof Date)
      return new Date(value);
  }, z.date().optional()),
  poster: z.string().max(255).optional(),
});

type ModifyMovieInput = z.infer<typeof ModifyMovieInputSchema>;

export class MovieService {
  async add(movie: AddMovieInput) {
    return await MovieModel.query().insertAndFetch({
      title: movie.title,
      director: movie.director,
      mainStar: movie.mainStar,
      description: movie.description,
      releaseDate: movie.releaseDate,
      poster: movie.poster,
    });
  }

  async deleteById(id: number) {
    return await MovieModel.query().deleteById(id);
  }

  async listAllMovies(pageNumber: number, size: number, searchText?: string) {
    return await MovieModel.query()
      .where(
        "title",
        "ilike",
        `%${searchText?.replace(/%/g, "%")?.replace(/_/g, "_")}%`
      )
      .orderBy("title", "ASC")
      .page(pageNumber - 1, size);
  }

  async moviesOrderedByAverageRating(pageNumber: number, size: number) {
    return await MovieModel.query()
      .leftJoin("reviews", "movies.id", "=", "reviews.movieId")
      .select("movies.*")
      .avg("reviews.rating as rate")
      .groupBy("movies.id")
      .orderByRaw("rate DESC NULLS LAST, title ASC") //nulls: 'last' does not work in .orderBy() so I use orderByRaw
      .page(pageNumber - 1, size);
  }

  async getMovieById(id: number) {
    return await MovieModel.query().findById(id);
  }

  async getMovieWithLikes(id: number) {
    return await MovieModel.query().findById(id).withGraphFetched("likedBy");
  }

  async getMovieWithComments(id: number) {
    return await MovieModel.query()
      .findById(id)
      .withGraphFetched("comments.[user]");
  }

  async getMovieWithReviews(id: number) {
    return await MovieModel.query()
      .findById(id)
      .withGraphFetched("reviews.[user]");
  }

  async getMovieWithInfo(id: number) {
    return await MovieModel.query()
      .findById(id)
      .withGraphFetched("[likedBy, comments.[user], reviews.[user]]");
  }

  async searchMoviesByDirector(director: string) {
    return await MovieModel.query().where("director", "like", director);
  }

  async update(id: number, data: ModifyMovieInput) {
    const movie = await MovieModel.query().findById(id);
    return await movie?.$query().patchAndFetch({
      title: data?.title,
      director: data?.director,
      mainStar: data?.mainStar,
      description: data?.description,
      releaseDate: data?.releaseDate,
      poster: data?.poster,
    });
  }
}
