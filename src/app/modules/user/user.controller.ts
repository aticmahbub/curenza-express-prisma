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
    const {page, limit, search, sortBy, sortOrder} = req.query;
    const result = await UserService.getALlUsers({
        page: Number(page),
        limit: Number(limit),
        search,
        sortBy,
        sortOrder,
    });
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Retrieved all users successfully',
        data: result,
    });
});

export const UserController = {createPatient, createDoctor, getALlUsers};
