import { Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { UserModel } from './models/user.model';

export class UserRepository {
  constructor(@Inject('KnexConnection') private knexConnection: Knex) {}

  async findByEmail(email: string): Promise<UserModel> {
    return await this.knexConnection
      .table('users')
      .where('email', '=', email)
      .first();
  }

  async create(user: Partial<UserModel>): Promise<UserModel> {
    const userData = new UserModel(user).mapUserToDb();

    const [insertedUser] = await this.knexConnection
      .table('users')
      .insert(userData)
      .returning('*');

    return UserModel.mapUserFromDb(insertedUser);
  }
}
