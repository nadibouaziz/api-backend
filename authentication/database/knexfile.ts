import type { Knex } from 'knex';
import { setupConfig } from './config';

// Update with your config settings.

const config: Knex.Config = setupConfig();

module.exports = config;
