import type { Knex } from 'knex';

const defaultConfig: Knex.Config = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  migrations: {
    tableName: 'knex_migrations',
    extension: 'ts',
    directory: './migrations',
  },
  pool: {
    min: 0,
    max: 10,
  },
};

const mainConfig = {
  development: {
    ...defaultConfig,
    seeds: {
      directory: './seed',
    },
    debug: true,
  },
  test: {
    ...defaultConfig,
    seeds: {
      directory: './seed',
    },
  },
  production: {
    ...defaultConfig,
    pool: {
      min: 2,
      max: 10,
    },
  },
};

export const setupConfig = (): Knex.Config => {
  const config = mainConfig['development'];
  if (!config)
    throw Error(`The ${process.env.NODE_ENV} is not recognized as proper env`);
  return config;
};
