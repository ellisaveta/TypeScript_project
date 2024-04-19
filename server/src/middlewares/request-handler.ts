import { Request, Response, RequestHandler } from 'express';
import { errorHandler } from '../errors';

export class ResponseWithCode<T> {
    constructor(
        public readonly statusCode: number,
        public readonly body: T
    ) { }
}

export function requestHandler<T>
    (handler: (req: Request, res: Response) => Promise<T> | ResponseWithCode<T>): RequestHandler {
    return async (req, res) => {
        try {
            const result = await handler(req, res);
            if (result instanceof ResponseWithCode) {
                res.status(result.statusCode).send(result.body);
                return;
            }
            res.send(result);
        } catch (err) {
            errorHandler(err, res);
        }
    };
}