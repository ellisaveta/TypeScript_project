import { NextFunction, Request, Response } from 'express';
import { errorHandler, UnauthorizedError } from '../errors';
import { UserService } from '../services/user-service';
import { JwtService } from '../services/jwt-service';

const jwtService = new JwtService();
const userService = new UserService();

export async function authMiddleware(request: Request, response: Response, next: NextFunction) {
    try {
        const authHeader = request.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            throw new UnauthorizedError('Unauthorized!');
        }

        const token = authHeader.replace('Bearer ', '');

        let userInfo;

        try {
            userInfo = jwtService.parse(token);
        } catch (err) {
            throw new UnauthorizedError('Unauthorized!');
        }

        const user = await userService.getUserById(userInfo.id);

        if (!user) {
            throw new UnauthorizedError('Unauthorized!');
        }

        response.locals.userId = userInfo.id;

        next();

    } catch (err) {
        errorHandler(err, response);
    }
}

export function userIdFromLocals(res: Response): number {
    return res.locals.userId;
}