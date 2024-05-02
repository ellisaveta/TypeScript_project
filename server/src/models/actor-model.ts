import { BaseModel } from "./base-model";

class ActorModel extends BaseModel {
  static readonly tableName = "actors";
  name!: string;
  gender!: string;
  bio!: string | null;
  picture!: string | null;
}

export { ActorModel };
