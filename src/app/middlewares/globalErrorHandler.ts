import type {NextFunction, Request, Response} from 'express';

const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    let statusCode = 500;
    let success = false;
    let message = err.message || 'Something went wrong!';
    let error = err;

    res.status(statusCode).json({
        success,
        message,
        error,
    });
};

export default globalErrorHandler;
