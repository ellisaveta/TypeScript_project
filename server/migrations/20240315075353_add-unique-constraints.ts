import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('likes', function (table) {
        table.unique(['user_id', 'movie_id']);
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('likes', function (table) {
        table.dropUnique(['user_id', 'movie_id']);
    });
}

