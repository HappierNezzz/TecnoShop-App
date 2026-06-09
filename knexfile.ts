import type { Knex } from 'knex';
import * as dotenv from 'dotenv';
dotenv.config();

// Configuración base de Knex
const config: { [key: string]: Knex.Config } = {
  // Ambiente de Desarrollo (npm run migrate, npm run seed)
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '12345',
      database: process.env.DB_NAME || 'superheroedb',
    },
    // Directorios donde Knex buscará archivos
    migrations: {
      directory: './db/migrations',
      tableName: 'knex_migrations',
      extension: 'ts'
    },
    seeds: {
      directory: './db/seeds',
      extension: 'ts'
    },
    pool: {
      min: 2,
      max: 10
    }
  },
  
  // Ambiente de Producción
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL as string,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './db/migrations',
      tableName: 'knex_migrations',
      extension: 'ts'
    },
    seeds: {
      directory: './db/seeds',
      extension: 'ts'
    }
  }
};

module.exports = config;