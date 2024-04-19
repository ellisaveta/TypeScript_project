import { Router } from "express";
import { NotFoundError } from "../errors";
import { authMiddleware } from "../middlewares/auth-middleware";
import { requestHandler } from "../middlewares/request-handler";
import { CommentService } from "../services/comment-service";
import { z } from "zod";
import { isCurrentlyLoggedUserTheOwner } from "./users";

const commentRouter = Router();
const commentService = new CommentService();

const IdInputSchema = z.object({
  id: z.preprocess((value) => Number(value), z.number().positive()),
});

const CommentModifyInputSchema = z.object({
  content: z.string().min(1),
});

export async function findCommentWithThatId(id: number) {
  const comment = await commentService.getCommentById(id);

  if (!comment) {
    throw new NotFoundError(`There is no comment with id: ${id}`);
  }

  return comment;
}

commentRouter.patch(
  "/:id",
  authMiddleware,
  requestHandler(async (req, res) => {
    const { id } = IdInputSchema.parse(req.params);
    const comment = await findCommentWithThatId(id);
    isCurrentlyLoggedUserTheOwner(res, comment.userId);
    const { content } = CommentModifyInputSchema.parse(req.body);
    const modifiedComment = await commentService.update(id, content);
    return { modifiedComment };
  })
);

commentRouter.delete(
  "/:id",
  authMiddleware,
  requestHandler(async (req, res) => {
    const { id } = IdInputSchema.parse(req.params);
    const comment = await findCommentWithThatId(id);
    isCurrentlyLoggedUserTheOwner(res, comment.userId);
    const deletedComment = await commentService.deleteById(id);
    return { deletedComment };
  })
);

export { commentRouter };
