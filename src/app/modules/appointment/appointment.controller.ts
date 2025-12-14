import type {Request, Response} from 'express';
import catchAsync from '../../utils/catchAsync';
import {AppointmentService} from './appointment.service';
import sendResponse from '../../utils/sendResponse';
import type {IJWTPayload} from '../../types/common';

const createAppointment = catchAsync(
    async (req: Request & {user?: IJWTPayload}, res: Response) => {
        const user = req.user;
        const result = await AppointmentService.createAppointment(
            user as IJWTPayload,
            req.body,
        );

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: 'Appointment is created successfully',
            data: result,
        });
    },
);

export const AppointmentController = {createAppointment};
