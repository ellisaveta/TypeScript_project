import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("movies", (table) => {
    table.integer("main_star").unsigned().alter();

    table.foreign("main_star").references("actors.id");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("movies", (table) => {
    table.dropForeign("main_star");

    table.string("main_star");
  });
}
