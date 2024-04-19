import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    const tableExists = await knex.schema.hasTable('comments');
    if (!tableExists) {
        await knex.schema.createTable('comments', table => {
            table.increments('id').primary();
            table.integer('user_id').notNullable()
                .references('id').inTable('users').onDelete('CASCADE');
            table.integer('movie_id').notNullable()
                .references('id').inTable('movies').onDelete('CASCADE');
            table.text('content').notNullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        });
    }
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('comments');
}

