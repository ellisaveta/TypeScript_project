import type { Knex } from "knex";
import { knexSnakeCaseMappers } from "objection";
import { config } from "./src/config";

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: "postgresql",
    connection: config.get("db"),
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
    ...knexSnakeCaseMappers(),
  },
  test: {
    client: "postgresql",
    connection: {
      ...config.get("db"),
      database: config.get("db.testDatabase"),
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
    ...knexSnakeCaseMappers(),
  },
};

export default knexConfig;
