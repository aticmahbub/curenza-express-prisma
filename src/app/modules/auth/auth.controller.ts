import type {Request, Response} from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import {AuthService} from './auth.service';

const login = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'User is logged in successfully',
        data: result,
    });
});

export const AuthController = {login};
