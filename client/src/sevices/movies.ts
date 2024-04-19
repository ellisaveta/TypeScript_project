import { UserModel } from "./auth";
import { HttpService } from "./http";

export interface MovieModel {
    id: string;
    title: string;
    director?: string;
    mainStar?: string;
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

    async getById(movieId: number) {
        const body = await this.http.get<{ movie: MovieModel }>(`/movies/${movieId}/info`);
        return body.movie;
    }

    async getAllMovies(page: number, size: number, searchText?: string) {
        const pageAsString = page.toString();
        const sizeAsString = size.toString();
        const body = await this.http.get<GetMoviesResponse>('/movies', {
            query: {
                page: pageAsString,
                size: sizeAsString,
                searchText: searchText ? searchText : ''
            }
        });
        return body;
    }

    async addComment(movieId: number, content: string) {
        const body = await this.http.post<CommentModel>(`/movies/${movieId}/comment`, {
            body: { content }
        });
        return body;
    }

    async addLike(movieId: number) {
        const body = await this.http.post<LikeModel>(`/movies/${movieId}/like`, {});
        return body;
    }
}

export const moviesService = new MoviesService();