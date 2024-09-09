import type { Knex } from 'knex';

const tableName = 'users';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.hasTable('users').then((exist) => {
    if (!exist) {
      return knex.schema.createTable(tableName, function (table) {
        table
          .uuid('id', { primaryKey: true })
          .defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('username').unique().index().notNullable();
        table.string('email').unique().index().notNullable();
        table.string('password').notNullable();
        table.string('salt').notNullable();
        table.string('firstname');
        table.string('lastname');
        table.string('birthday');
        table.string('profile_picture');
        table
          .timestamp('created_at', { precision: 3 })
          .defaultTo(knex.fn.now())
          .notNullable();
        table
          .timestamp('updated_at', { precision: 3 })
          .defaultTo(knex.fn.now())
          .notNullable();
      });
    }
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(tableName);
}
