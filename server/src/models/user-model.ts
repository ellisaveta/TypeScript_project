import { Modifiers } from "objection";
import { BaseModel } from "./base-model";

export enum UserRole {
  Admin = "admin",
  User = "user",
}

class UserModel extends BaseModel {
  static readonly tableName = "users";
  name!: string;
  email!: string;
  password!: string;
  role!: string;

  static modifiers: Modifiers = {
    dontShowPasswordUser(query) {
      query.select("users.id", "users.name", "users.email", "user.role");
    },
  };
}

export { UserModel };
