import { Router } from "express";
import { NotFoundError } from "../errors";
import { RegistrationInputSchema, UserService } from "../services/user-service";
import {
  requestHandler,
  ResponseWithCode,
} from "../middlewares/request-handler";
import { JwtService } from "../services/jwt-service";
import { z } from "zod";

const authRouter = Router();
const jwtService = new JwtService();
const userService = new UserService();

authRouter.post(
  "/registration",
  requestHandler(async (req) => {
    const input = RegistrationInputSchema.parse(req.body);

    const user = await userService.register(input);
    const token = jwtService.create({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    return new ResponseWithCode(201, { token: token, name: user.name });
  })
);

const LoginInputSchema = z.object({
  email: z.string(),
  password: z.string(),
});

authRouter.post(
  "/login",
  requestHandler(async (req) => {
    const { email, password } = LoginInputSchema.parse(req.body);

    await wait(2000);

    const user = await userService.login(email, password);
    if (!user) {
      throw new NotFoundError("Email or password is incorrect!");
    }

    const token = jwtService.create({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { token: token, name: user.name };
  })
);

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(undefined);
    }, ms);
  });
}

export { authRouter };
