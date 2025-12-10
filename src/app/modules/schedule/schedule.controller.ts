import type {Request, Response} from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import {ScheduleServices} from './schedule.service';

const addSchedule = catchAsync(async (req: Request, res: Response) => {
    const result = await ScheduleServices.addSchedule(req.body);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Schedule is created successfully',
        data: result,
    });
});

const schedulesForDoctor = catchAsync(async (req: Request, res: Response) => {
    const result = await ScheduleServices.addSchedule(req.body);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Schedule is created successfully',
        data: result,
    });
});

export const ScheduleController = {addSchedule, schedulesForDoctor};
