import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTableIfNotExists('products', (table) => {
        table.increments('id').primary();
        table.string('nombre', 100).notNullable();
        table.text('descripcion');
        table.decimal('precio', 10, 2).notNullable();
        table.string('imagen_url', 255).notNullable();
        table.integer('stock').defaultTo(0);
        table.string('categoria', 100);
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('products');
}