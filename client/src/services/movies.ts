import { Dayjs } from "dayjs";
import { omit } from "lodash";
import { UserModel } from "./auth";
import { HttpService } from "./http";

export interface MainStarType {
  inputValue?: string;
  id: number;
  name: string;
}

export interface InputMovieModel {
  title?: string;
  director?: string;
  mainStar: MainStarType | null;
  description?: string;
  releaseDate: Dayjs | null;
  poster?: string;
}

export interface MovieModel {
  id: string;
  title: string;
  director?: string;
  mainStar?: number;
  description?: string;
  releaseDate?: Date;
  poster: string;
  likedBy?: UserModel[];
  comments?: CommentModel[];
  reviews?: ReviewModel[];
}

export interface LikeModel {
  userId: number;
  movieId: number;
}

export interface CommentModel {
  id: number;
  user: UserModel;
  movieId: number;
  content: string;
}

export interface ReviewModel {
  id: number;
  user: UserModel;
  movieId: number;
  rating: number;
  content: string;
}

interface GetMoviesResponse {
  movies: MovieModel[];
  total: number;
}

class MoviesService {
  private http = new HttpService();

  async getById(movieId: string) {
    const body = await this.http.get<{ movie: MovieModel }>(
      `/movies/${movieId}/info`
    );
    return body.movie;
  }

  async getAllMovies(page: number, size: number, searchText?: string) {
    const pageAsString = page.toString();
    const sizeAsString = size.toString();
    const body = await this.http.get<GetMoviesResponse>("/movies", {
      query: {
        page: pageAsString,
        size: sizeAsString,
        searchText: searchText ? searchText : "",
      },
    });
    return body;
  }

  async addMovie(input: InputMovieModel) {
    const body = await this.http.post<MovieModel>("/movies", {
      body: { ...omit(input, "mainStar"), mainStar: input.mainStar?.id },
    });
    return body;
  }

  async editMovie(movieId: string, input: InputMovieModel) {
    const body = await this.http.patch<MovieModel>(`/movies/${movieId}`, {
      body: { ...omit(input, "mainStar"), mainStar: input.mainStar?.id },
    });
    return body;
  }

  async deleteMovie(movieId: string) {
    const body = await this.http.delete<MovieModel>(`/movies/${movieId}`, {});
    return body;
  }

  async addComment(movieId: string, content: string) {
    const body = await this.http.post<CommentModel>(
      `/movies/${movieId}/comment`,
      {
        body: { content },
      }
    );
    return body;
  }

  async addLike(movieId: string) {
    const body = await this.http.post<LikeModel>(`/movies/${movieId}/like`, {});
    return body;
  }
}

export const moviesService = new MoviesService();
