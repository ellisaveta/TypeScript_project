import { z } from "zod";
import { ActorModel } from "../models/actor-model";

const GENDER_VALUES = ["male", "female"] as const;

export const AddActorInputSchema = z.object({
  name: z
    .string()
    .min(2, "Name should have at least 2 alphabets")
    .refine(
      (value) => /^[a-zA-Z]+[-'s]?[a-zA-Z ]+$/.test(value),
      "Name should contain only alphabets"
    )
    .refine(
      (value) => /^[a-zA-Z]+\s+[a-zA-Z]+$/.test(value),
      "Please enter both first name and last name"
    ),
  gender: z.enum(GENDER_VALUES, { required_error: "Gender is required!" }),
  bio: z.string().min(10).optional(),
  picture: z.string().max(255).optional(),
});

type AddActorInput = z.infer<typeof AddActorInputSchema>;

export const ModifyActorInputSchema = z.object({
  name: z
    .string()
    .min(2, "Name should have at least 2 alphabets")
    .refine(
      (value) => /^[a-zA-Z]+[-'s]?[a-zA-Z ]+$/.test(value),
      "Name should contain only alphabets"
    )
    .refine(
      (value) => /^[a-zA-Z]+\s+[a-zA-Z]+$/.test(value),
      "Please enter both first name and last name"
    )
    .optional(),
  gender: z.enum(GENDER_VALUES).optional(),
  bio: z.string().min(10).optional(),
  picture: z.string().max(255).optional(),
});

type ModifyActorInput = z.infer<typeof ModifyActorInputSchema>;

export class ActorService {
  async add(actor: AddActorInput) {
    return await ActorModel.query().insertAndFetch({
      ...actor,
    });
  }

  async deleteById(id: number) {
    return await ActorModel.query().deleteById(id);
  }

  async getById(id: number) {
    return await ActorModel.query().findById(id);
  }

  async listAllActors(pageNumber: number, size: number, searchText?: string) {
    return await ActorModel.query()
      .where(
        "name",
        "ilike",
        `%${searchText?.replace(/%/g, "%")?.replace(/_/g, "_")}%`
      )
      .orderBy("title", "ASC")
      .page(pageNumber - 1, size);
  }

  async update(id: number, data: ModifyActorInput) {
    const actor = await ActorModel.query().findById(id);
    return await actor?.$query().patchAndFetch({ ...data });
  }
}
