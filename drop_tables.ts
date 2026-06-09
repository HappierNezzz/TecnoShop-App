import knex from './src/database';

async function main() {
  console.log('Dropping all tables...');
  try {
    await knex.schema.dropTableIfExists('favorites');
    await knex.schema.dropTableIfExists('cart_items');
    await knex.schema.dropTableIfExists('catsuperheroe');
    await knex.schema.dropTableIfExists('products');
    await knex.schema.dropTableIfExists('users');
    await knex.schema.dropTableIfExists('knex_migrations');
    await knex.schema.dropTableIfExists('knex_migrations_lock');
    console.log('All tables dropped successfully.');
  } catch (err) {
    console.error('Error dropping tables:', err);
  } finally {
    await knex.destroy();
  }
}

main();
