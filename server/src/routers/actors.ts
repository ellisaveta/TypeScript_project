import { Router } from "express";
import { z } from "zod";
import {
  ActorService,
  AddActorInputSchema,
  ModifyActorInputSchema,
} from "../services/actor-service";
import { NotFoundError } from "../errors";
import { authMiddleware } from "../middlewares/auth-middleware";
import {
  ResponseWithCode,
  requestHandler,
} from "../middlewares/request-handler";
import { ActorTransformer } from "../transformers/actor-transformer";
import { adminMiddleware } from "../middlewares/admin-middleware";

const actorRouter = Router();
const actorService = new ActorService();
const actorTransformer = new ActorTransformer();

const IdInputSchema = z.object({
  id: z.preprocess((value) => Number(value), z.number().positive()),
});

const GetActorsInputSchema = z.object({
  page: z.preprocess((value) => Number(value ?? 1), z.number().positive()),
  size: z.preprocess((value) => Number(value ?? 10), z.number().positive()),
  searchText: z.string().optional(),
});

export async function findActorWithThatId(id: number) {
  const actor = await actorService.getById(id);

  if (!actor) {
    throw new NotFoundError(`There is no actor with id: ${id}`);
  }

  return actor;
}

actorRouter.get(
  "/",
  authMiddleware,
  requestHandler(async (req) => {
    const { page, size, searchText } = GetActorsInputSchema.parse(req.query);
    const { results, total } = await actorService.listAllActors(
      page,
      size,
      searchText
    );
    return { actors: actorTransformer.transformArray(results), total };
  })
);

actorRouter.get(
  "/:id",
  authMiddleware,
  requestHandler(async (req) => {
    const { id } = IdInputSchema.parse(req.params);

    const actor = await findActorWithThatId(id);
    return { actor: actorTransformer.transform(actor) };
  })
);

actorRouter.post(
  "/",
  authMiddleware,
  adminMiddleware,
  requestHandler(async (req) => {
    const input = AddActorInputSchema.parse(req.body);
    const actor = await actorService.add(input);

    return new ResponseWithCode(201, actorTransformer.transform(actor));
  })
);

actorRouter.patch(
  "/:id",
  authMiddleware,
  adminMiddleware,
  requestHandler(async (req) => {
    const { id } = IdInputSchema.parse(req.params);
    const input = ModifyActorInputSchema.parse(req.body);
    await findActorWithThatId(id);

    const modifiedActor = await actorService.update(id, input);

    if (!modifiedActor) {
      throw new NotFoundError(
        `Nothing was modified! There is no actor with id: ${id}!`
      );
    }

    return { actor: actorTransformer.transform(modifiedActor) };
  })
);

actorRouter.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  requestHandler(async (req) => {
    const { id } = IdInputSchema.parse(req.params);
    await findActorWithThatId(id);

    const deletedActor = await actorService.deleteById(id);
    return { deletedActor };
  })
);

export { actorRouter };
