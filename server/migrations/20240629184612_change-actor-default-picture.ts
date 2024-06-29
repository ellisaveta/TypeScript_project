import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("actors", (table) => {
    table
      .string("picture")
      .defaultTo(
        "https://www.shutterstock.com/shutterstock/photos/1229859850/display_1500/stock-vector-avatar-man-icon-profile-placeholder-anonymous-user-male-no-photo-web-template-default-user-1229859850.jpg"
      )
      .alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("actors", (table) => {
    table
      .string("picture")
      .defaultTo(
        "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0="
      );
  });
}
