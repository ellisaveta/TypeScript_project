import { ActorModel } from "../models/actor-model";

export class ActorTransformer {
  constructor() {}
  transform(actor: ActorModel) {
    return {
      id: actor.id,
      name: actor.name,
      gender: actor.gender,
      bio: actor.bio ? actor.bio : undefined,
      picture: actor.picture ? actor.picture : undefined,
    };
  }

  transformArray(actors: ActorModel[]) {
    return actors.map((actor) => this.transform(actor));
  }
}
