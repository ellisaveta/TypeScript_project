import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTableIfNotExists('movies', table => {
        table.increments('id').primary();
        table.string('title').notNullable;
        table.string('director');
        table.string('main_star');
        table.text('description');
        table.date('release_date');
        table.string('poster').defaultTo('https://thumbs.dreamstime.com/z/no-image-available-icon-flat-vector-illustration-132483587.jpg');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('movies');
}

