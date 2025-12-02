import type {Request, Response} from 'express';
import {UserService} from './user.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const createPatient = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createPatient(req);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Patient is created successfully',
        data: result,
    });
});

export const UserController = {createPatient};
