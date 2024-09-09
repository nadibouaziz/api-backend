import { Exclude, Expose } from 'class-transformer';

export class UserModel {
  constructor(partial: Partial<UserModel>) {
    Object.assign(this, partial);
  }

  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  firstname: string;

  @Expose()
  lastname: string;

  @Expose()
  birthday: Date;

  @Expose()
  profilePicture: string;

  @Exclude()
  password: string;

  @Exclude()
  salt: string;

  static mapUserFromDb(dbUser: any): UserModel {
    return new UserModel({
      username: dbUser.username,
      email: dbUser.email,
      firstname: dbUser.firstname,
      lastname: dbUser.lastname,
      birthday: dbUser.birthday,
      profilePicture: dbUser.profile_picture,
      password: dbUser.password,
      salt: dbUser.salt,
    });
  }

  mapUserToDb(): Record<string, any> {
    return {
      username: this.username,
      email: this.email,
      firstname: this.firstname,
      lastname: this.lastname,
      birthday: this.birthday,
      profile_picture: this.profilePicture,
      password: this.password,
      salt: this.salt,
    };
  }
}
