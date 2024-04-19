import { CommentModel } from "../models/comment-model";
import { UserTransformer } from "./user-transformer";

export class CommentTransformer {
    constructor(private userTransformer: UserTransformer) { }
    transform(comment: CommentModel) {

        return {
            id: comment.id,
            user: comment.user ? this.userTransformer.transform(comment.user) : undefined,
            movieId: comment.movieId,
            content: comment.content
        }
    }

    transformArray(comments: CommentModel[]) {
        return comments.map(comment => this.transform(comment));
    }
}