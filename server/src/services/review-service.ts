import { ReviewModel } from "../models/review-model";
import { z } from 'zod';

export const AddReviewInputSchema = z.object({
    rating: z.preprocess(value => Number(value), z.number().min(1).max(5)),
    content: z.string().min(10).optional()
});

type AddReviewInput = z.infer<typeof AddReviewInputSchema>;

export const ModifyReviewInputSchema = z.object({
    rating: z.preprocess(value => Number(value), z.number().min(1).max(5)).optional(),
    content: z.string().min(10).optional()
});

type ModifyReviewInput = z.infer<typeof ModifyReviewInputSchema>;


export class ReviewService {
    async add(userId: number, movieId: number, review: AddReviewInput) {
        return await ReviewModel.query().insertAndFetch({ userId, movieId, rating: review.rating, content: review.content });
    }

    async deleteById(id: number) {
        return await ReviewModel.query().deleteById(id);
    }

    async getReviewById(id: number) {
        return await ReviewModel.query().findById(id);
    }

    async update(id: number, data: ModifyReviewInput) {
        const review = await ReviewModel.query().findById(id);
        return await review?.$query().patchAndFetch({ rating: data?.rating, content: data?.content });
    }
}