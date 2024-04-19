import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.table('users', table => {
        table.index('name', 'idx_name');
    });

    await knex.schema.table('movies', table => {
        table.index('title', 'idx_title');
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table('users', table => {
        table.dropIndex('name', 'idx_name');
    });

    await knex.schema.table('movies', table => {
        table.dropIndex('title', 'idx_title');
    });
}

