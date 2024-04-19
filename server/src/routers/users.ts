import { Response, Router } from "express";
import { NotFoundError, UnauthorizedError } from "../errors";
import {
  authMiddleware,
  userIdFromLocals,
} from "../middlewares/auth-middleware";
import { requestHandler } from "../middlewares/request-handler";
import { ModifyUserInputSchema, UserService } from "../services/user-service";
import { z } from "zod";
import { UserTransformer } from "../transformers/user-transformer";
import { adminMiddleware } from "../middlewares/admin-middleware";

const userRouter = Router();
const userService = new UserService();
const userTransformer = new UserTransformer();

const IdInputSchema = z.object({
  id: z.preprocess((value) => Number(value), z.number().positive()),
});

export async function findUserWithThatId(id: number) {
  const user = await userService.getUserById(id);

  if (!user) {
    throw new NotFoundError(`There is no user with id: ${id}`);
  }

  return user;
}

export function isCurrentlyLoggedUserTheOwner(res: Response, userId: number) {
  if (userIdFromLocals(res) !== userId) {
    throw new UnauthorizedError(
      "This operation can be performed only by the owner!"
    );
  }
  return true;
}

userRouter.patch(
  "/:id",
  authMiddleware,
  requestHandler(async (req, res) => {
    const { id } = IdInputSchema.parse(req.params);

    await findUserWithThatId(id);
    isCurrentlyLoggedUserTheOwner(res, id);

    const input = ModifyUserInputSchema.parse(req.body);

    const user = await userService.update(id, input);

    if (user) {
      return { user: userTransformer.transform(user) };
    }

    return { user };
  })
);

userRouter.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  requestHandler(async (req, res) => {
    const { id } = IdInputSchema.parse(req.params);

    await findUserWithThatId(id);

    const user = await userService.deleteById(id);

    return { user };
  })
);

export { userRouter };
