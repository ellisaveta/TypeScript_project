import jwtDecode from "jwt-decode";
import { LocalStorage } from "../lib/localStorage";

export enum UserRole {
  Admin = "admin",
  User = "user",
}

export interface UserInfo {
  tokenInfo: UserTokenInfo;
  name: string;
}

interface UserTokenInfo {
  id: string;
  email: string;
  role: UserRole;
}

export type AuthHandler = (user: UserInfo | undefined) => void;

class UserInfoStorage {
  private handler: AuthHandler | undefined = undefined;
  private tokenStorage = new LocalStorage<string>("token");
  private nameStorage = new LocalStorage<string>("name");

  setHandler(handler: AuthHandler | undefined) {
    this.handler = handler;
  }

  get token() {
    return this.tokenStorage.get();
  }

  get name() {
    return this.nameStorage.get();
  }

  save(token: string, name: string) {
    this.tokenStorage.set(token);
    this.nameStorage.set(name);
    this.handler?.(this.userInfo);
  }

  clear() {
    this.tokenStorage.clear();
    this.nameStorage.clear();
    this.handler?.(undefined);
  }

  get userInfo() {
    const token = this.token;
    const name = this.name;
    return token
      ? name
        ? { tokenInfo: this.userInfoFromToken(token), name: name }
        : undefined
      : undefined;
  }

  private userInfoFromToken(token: string): UserTokenInfo {
    return jwtDecode(token);
  }
}

export const userInfoStorage = new UserInfoStorage();
