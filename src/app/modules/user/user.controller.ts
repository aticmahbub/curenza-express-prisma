import type {Request, Response} from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import {UserService} from './user.service';
import {pick} from '../../utils/pick';
import {userFilterableFields} from './user.constants';

const createPatient = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createPatient(req);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Patient is created successfully',
        data: result,
    });
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createDoctor(req);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Doctor is created successfully',
        data: result,
    });
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createAdmin(req);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Admin Created successfuly!',
        data: result,
    });
});

const getALlUsers = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, userFilterableFields);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    console.log(filters);

    const result = await UserService.getALlUsers(filters, options);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Retrieved all users successfully',
        meta: result.meta,
        data: result.data,
    });
});

export const UserController = {
    createPatient,
    createDoctor,
    createAdmin,
    getALlUsers,
};
