import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const tableExists = await knex.schema.hasTable("actors");
  if (!tableExists) {
    await knex.schema.createTable("actors", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.string("gender").notNullable();
      table.text("bio");
      table
        .string("picture")
        .defaultTo(
          "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0="
        );
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("actors");
}
