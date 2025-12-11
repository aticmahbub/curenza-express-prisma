import type {NextFunction, Request, Response} from 'express';
import {Prisma} from '../../generated/client';

const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    let statusCode = err.statusCode || 500;
    let success = false;
    let message = err.message || 'Something went wrong!';
    let error = err;

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            message = 'Duplicate key error';
            error = err.meta;
            statusCode = 409;
        }
        if (err.code === 'P1000') {
            message = 'Authentication error';
            error = err.meta;
            statusCode = 502;
        }
        if (err.code === 'P2003') {
            message = 'Foreign key constraint failed';
            error = err.meta;
            statusCode = 502;
        }
    } else if (err instanceof Prisma.PrismaClientValidationError) {
        message = 'Validation error';
        error = err.message;
        statusCode = 402;
    } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        message = 'Unknown prisma error occurred';
        error = err.message;
        statusCode = 402;
    } else if (err instanceof Prisma.PrismaClientInitializationError) {
        message = 'Prisma client failed to initialized';
        error = err.message;
        statusCode = 402;
    }

    res.status(statusCode).json({
        success,
        message,
        error,
    });
};

export default globalErrorHandler;
