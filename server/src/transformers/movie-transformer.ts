import { MovieModel } from '../models/movie-model';
import { CommentTransformer } from './comment-transformer';
import { ReviewTransformer } from './review-transformer';
import { UserTransformer } from './user-transformer'

export class MovieTransformer {
    constructor(
        private userTransformer: UserTransformer,
        private commentTransformer: CommentTransformer,
        private reviewTransformer: ReviewTransformer) { }

    transform(movie: MovieModel) {
        return {
            id: movie.id,
            title: movie.title,
            director: movie.director ? movie.director : undefined,
            mainStar: movie.mainStar ? movie.mainStar : undefined,
            description: movie.description ? movie.description : undefined,
            releaseDate: movie.releaseDate ? movie.releaseDate : undefined,
            poster: movie.poster ? movie.poster : undefined,
            likedBy: movie.likedBy ? this.userTransformer.transformArray(movie.likedBy) : undefined,
            comments: movie.comments ? this.commentTransformer.transformArray(movie.comments) : undefined,
            reviews: movie.reviews ? this.reviewTransformer.transformArray(movie.reviews) : undefined
        };
    }

    transformArray(movies: MovieModel[]) {
        return movies.map(movie => this.transform(movie));
    }
}