import { LikeModel } from "../../src/models/like-model";
import { MovieModel } from "../../src/models/movie-model";
import { UserModel } from "../../src/models/user-model";
import { CommentModel } from "../../src/models/comment-model"
import { ReviewModel } from "../../src/models/review-model";

export function createUser(data: Partial<UserModel> = {}) {
    return UserModel.query().insertAndFetch({
        name: 'Philip Tomov',
        email: 'philip@mail.bg',
        password: 'philip1234',
        ...data
    });
}

export function createMovie(data: Partial<MovieModel> = {}) {
    return MovieModel.query().insertAndFetch({
        title: 'Titanic',
        director: 'James Cameron',
        mainStar: 'Leonardo DiCaprio',
        releaseDate: new Date('1997-11-01'),
        poster: 'https://www.shutterstock.com/image-vector/picture-vector-icon-no-image-260nw-1350441335.jpg',
        ...data
    });
}

export function createLike(data: Partial<LikeModel> = {}) {
    return LikeModel.query().insertAndFetch({
        ...data
    });
}

export function createComment(data: Partial<CommentModel> = {}) {
    return CommentModel.query().insertAndFetch({
        ...data
    });
}

export function createReview(data: Partial<ReviewModel> = {}) {
    return ReviewModel.query().insertAndFetch({
        movieId: 1,
        rating: 5,
        content: 'Liked it',
        ...data
    });
}