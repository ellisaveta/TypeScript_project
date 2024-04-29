import { HttpError, HttpService } from "./http";
import { userInfoStorage } from "./userInfoStorage";

export class InvalidCredentialsError extends Error {}

export interface RegistrationInput {
  name: string;
  email: string;
  password: string;
}

export interface UserModel {
  id: string;
  email: string;
  name: string;
  role: string;
}

class AuthService {
  private http = new HttpService();

  async login(email: string, password: string) {
    try {
      const body = await this.http.post<{ token: string; name: string }>(
        "/auth/login",
        { body: { email, password } }
      );
      userInfoStorage.save(body.token, body.name);
    } catch (error) {
      if (error instanceof HttpError && error.status === 404) {
        throw new InvalidCredentialsError();
      }

      throw error;
    }
  }

  logout() {
    userInfoStorage.clear();
  }

  async register(input: RegistrationInput) {
    const body = await this.http.post<{ token: string; name: string }>(
      "/auth/registration",
      {
        body: input,
      }
    );

    userInfoStorage.save(body.token, body.name);
    return body;
  }
}

export const authService = new AuthService();
