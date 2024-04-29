import { Model, ModelOptions, QueryContext } from "objection";

class BaseModel extends Model {
  id!: number;
  createdAt!: Date;
  updatedAt!: Date;

  async $beforeUpdate(opt: ModelOptions, queryContext: QueryContext) {
    await super.$beforeUpdate(opt, queryContext);
    this.updatedAt = new Date();
  }
}

export { BaseModel };
