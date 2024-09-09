import { Global, Module } from '@nestjs/common';
import { setupConfig } from '../../../database/config';
import Knex from 'knex';

/**
 * Using Knex there is no way to check if the connection
 * is well established except by executing a SQL request
 * FYI : The attribute `knex.client.connectionSettings` is not good either
 * if the URI is : blablabla, connectionSettings will be equal to blabla and it won't throw an error
 **/
const providers = [
  {
    provide: 'KnexConnection',
    useFactory: async () => {
      const dbConfig = setupConfig();
      const knex = Knex(dbConfig);
      try {
        await knex.raw('SELECT 1'); // A simple query to test the connection
      } catch (error) {
        console.error('Database config: ', dbConfig);
        throw new Error('Database connection failed: ' + error.message);
      }
      return knex;
    },
  },
];

@Global()
@Module({
  providers: [...providers],
  exports: [...providers],
})
export class DatabaseModule {}
