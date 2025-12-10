import type {NextFunction, Request, Response} from 'express';
import {verifyToken} from '../utils/verifyToken';
import config from '../../config';

export const checkAuth = (...roles: string[]) => {
    return async (
        req: Request & {user?: any},
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const token = req.cookies.accessToken;

            if (!token) {
                throw new Error('No token received');
            }

            const verifiedUser = verifyToken(
                token,
                String(config.jwt.jwt_access_secret),
            );

            req.user = verifiedUser;

            if (roles.length && !roles.includes(verifiedUser.role)) {
                throw new Error('You are not authorized');
            }

            next();
        } catch (error) {
            console.log(error);
            next(error);
        }
    };
};
