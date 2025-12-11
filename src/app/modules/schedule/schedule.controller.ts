import type {Request, Response} from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import {ScheduleServices} from './schedule.service';
import {pick} from '../../utils/pick';
import type {IJWTPayload} from '../../types/common';

const addSchedule = catchAsync(async (req: Request, res: Response) => {
    const result = await ScheduleServices.addSchedule(req.body);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Schedule is created successfully',
        data: result,
    });
});

const schedulesForDoctor = catchAsync(
    async (req: Request & {user?: IJWTPayload}, res: Response) => {
        const options = pick(req.query, [
            'page',
            'limit',
            'skip',
            'sortBy',
            'sortOrder',
        ]);
        const filters = pick(req.query, ['startDateTime', 'endDateTime']);

        const user = req.user;

        const result = await ScheduleServices.schedulesForDoctor(
            user as IJWTPayload,
            filters,
            options,
        );
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: 'Schedules fetched  successfully',
            meta: result.meta,
            data: result.data,
        });
    },
);

const deleteSchedule = catchAsync(async (req: Request, res: Response) => {
    const result = await ScheduleServices.deleteSchedule(req.params.id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Schedule is deleted successfully',
        data: result,
    });
});

export const ScheduleController = {
    addSchedule,
    schedulesForDoctor,
    deleteSchedule,
};
