import type {Request, Response} from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import {UserService} from './user.service';
import {pick} from '../../utils/pick';

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

const getALlUsers = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, ['status', 'role', 'email', 'search']);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

    const {page, limit, search, sortBy, sortOrder} = req.query;
    const result = await UserService.getALlUsers(filters, options);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Retrieved all users successfully',
        data: result,
    });
});

export const UserController = {createPatient, createDoctor, getALlUsers};
