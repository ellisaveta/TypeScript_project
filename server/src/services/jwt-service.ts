import jwt from "jsonwebtoken";
import { config } from "../config";

export interface JwtData {
  id: number;
  email: string;
  role: string;
}

export class JwtService {
  create(user: JwtData): string {
    const { expiryTime, privateKey } = config.get("jwt");

    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      privateKey,
      {
        expiresIn: expiryTime,
      }
    );
  }

  parse(token: string): JwtData {
    return jwt.verify(token, config.get("jwt.privateKey")) as JwtData;
  }
}
