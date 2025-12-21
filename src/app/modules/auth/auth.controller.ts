import type {Request, Response} from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import {AuthService} from './auth.service';

const login = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);

    const {accessToken, refreshToken, needPasswordChange} = result;

    res.cookie('accessToken', accessToken, {secure: true, sameSite: 'none'});
    res.cookie('refreshToken', refreshToken, {secure: true, sameSite: 'none'});

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'User is logged in successfully',
        data: {needPasswordChange, accessToken: result.accessToken},
    });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
    const userSession = req.cookies;
    const result = await AuthService.getMe(userSession);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'User is retrieved successfully',
        data: result,
    });
});

export const AuthController = {login, getMe};
