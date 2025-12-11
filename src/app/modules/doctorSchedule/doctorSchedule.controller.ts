import type {Request, Response} from 'express';
import catchAsync from '../../utils/catchAsync';
import {UserService} from '../user/user.service';
import sendResponse from '../../utils/sendResponse';
import {DoctorScheduleService} from './doctorSchedule.service';
import type {IJWTPayload} from '../../types/common';

const addDoctorSchedule = catchAsync(
    async (req: Request & {user?: IJWTPayload}, res: Response) => {
        const user = req.user;

        const result = await DoctorScheduleService.addDoctorSchedule(
            user as IJWTPayload,
            req.body,
        );
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: 'Patient is created successfully',
            data: result,
        });
    },
);
export const DoctorScheduleController = {addDoctorSchedule};
