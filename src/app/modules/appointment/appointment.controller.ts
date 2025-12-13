import type {Request, Response} from 'express';
import catchAsync from '../../utils/catchAsync';
import {AppointmentService} from './appointment.service';
import sendResponse from '../../utils/sendResponse';

const createAppointment = catchAsync(async (req: Request, res: Response) => {
    const result = await AppointmentService.createAppointment(req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Appointment is created successfully',
        data: result,
    });
});

export const AppointmentController = {createAppointment};
