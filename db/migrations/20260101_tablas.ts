import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTableIfNotExists('catsuperheroe', (table) => {
        table.increments('id').primary();
        table.string('nombre', 100).notNullable().unique();
        table.string('poder', 255).notNullable();
        table.string('fortaleza', 255);
        table.string('resistencia', 255);
        table.string('debilidad', 255);
        table.string('imagen_url', 255).notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('catsuperheroe');
}