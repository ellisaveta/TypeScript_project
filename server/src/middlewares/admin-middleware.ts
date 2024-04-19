import { NextFunction, Request, Response } from "express";
import { JwtService } from "../services/jwt-service";
import { UserRole } from "../models/user-model";
import { UnauthorizedError, errorHandler } from "../errors";

const jwtService = new JwtService();

export async function adminMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const authHeader = request.headers.authorization;

    const token = authHeader!.replace("Bearer ", "");
    const userInfo = jwtService.parse(token);

    if (userInfo.role !== UserRole.Admin) {
      throw new UnauthorizedError("No permissions for this action!");
    }

    next();
  } catch (err) {
    errorHandler(err, response);
  }
}
