import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Check and create users table
  const hasUsers = await knex.schema.hasTable('users');
  if (!hasUsers) {
    await knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('nombre', 100).notNullable();
      table.string('email', 150).notNullable().unique();
      table.string('password', 255).notNullable();
      table.string('role', 50).defaultTo('user');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  }

  // Check and create cart_items table
  const hasCartItems = await knex.schema.hasTable('cart_items');
  if (!hasCartItems) {
    await knex.schema.createTable('cart_items', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable()
        .references('id').inTable('users').onDelete('CASCADE');
      table.integer('product_id').unsigned().notNullable()
        .references('id').inTable('products').onDelete('CASCADE');
      table.integer('cantidad').notNullable().defaultTo(1);
      table.unique(['user_id', 'product_id']);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('cart_items');
  await knex.schema.dropTableIfExists('users');
}
