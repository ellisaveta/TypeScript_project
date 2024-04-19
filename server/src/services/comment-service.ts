import { CommentModel } from "../models/comment-model";

export class CommentService {
    async add(userId: number, movieId: number, content: string) {
        return await CommentModel.query().insertAndFetch({ userId, movieId, content });
    }

    async deleteById(id: number) {
        return await CommentModel.query().deleteById(id);
    }

    async getCommentById(id: number) {
        return await CommentModel.query().findById(id);
    }

    async update(id: number, content: string) {
        const comment = await CommentModel.query().findById(id);
        return await comment?.$query().patchAndFetch({ content });
    }
}