import { Router } from "express";
import { authMiddleware } from "../middlewares/auth-middleware";
import { requestHandler } from "../middlewares/request-handler";
import { z } from "zod";
import {
  ModifyReviewInputSchema,
  ReviewService,
} from "../services/review-service";
import { NotFoundError } from "../errors";
import { isCurrentlyLoggedUserTheOwner } from "./users";

const reviewRouter = Router();
const reviewService = new ReviewService();

const IdInputSchema = z.object({
  id: z.preprocess((value) => Number(value), z.number().positive()),
});

export async function findReviewWithThatId(id: number) {
  const review = await reviewService.getReviewById(id);

  if (!review) {
    throw new NotFoundError(`There is no review with id: ${id}`);
  }

  return review;
}

reviewRouter.patch(
  "/:id",
  authMiddleware,
  requestHandler(async (req, res) => {
    const { id } = IdInputSchema.parse(req.params);
    const review = await findReviewWithThatId(id);
    isCurrentlyLoggedUserTheOwner(res, review.userId);
    const input = ModifyReviewInputSchema.parse(req.body);
    const modifiedReview = await reviewService.update(id, input);
    return { modifiedReview };
  })
);

reviewRouter.delete(
  "/:id",
  authMiddleware,
  requestHandler(async (req, res) => {
    const { id } = IdInputSchema.parse(req.params);
    const review = await findReviewWithThatId(id);
    isCurrentlyLoggedUserTheOwner(res, review.userId);
    const deletedReview = await reviewService.deleteById(id);
    return { deletedReview };
  })
);

export { reviewRouter };
