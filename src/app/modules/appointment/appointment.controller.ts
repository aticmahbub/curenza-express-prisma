import type {Request, Response} from 'express';
import catchAsync from '../../utils/catchAsync';
import {AppointmentService} from './appointment.service';
import sendResponse from '../../utils/sendResponse';
import type {IJWTPayload} from '../../types/common';
import {pick} from '../../utils/pick';
import type {JwtPayload} from 'jsonwebtoken';

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

const getMyAppointments = catchAsync(
    async (req: Request & {user?: JwtPayload}, res: Response) => {
        const options = pick(req.query, [
            'page',
            'limit',
            'sortBy',
            'sortOrder',
        ]);
        const filters = pick(req.query, ['status', 'paymentStatus']);

        const user = req.user;

        const result = await AppointmentService.getMyAppointments(
            user,
            options,
            filters,
        );
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: 'Appointment is fetched successfully',
            data: result,
        });
    },
);

const updateAppointmentStatus = catchAsync(
    async (req: Request & {user?: JwtPayload}, res: Response) => {
        const {id} = req.params;
        const {status} = req.body;
        const user = req.user;

        const result = await AppointmentService.updateAppointmentStatus(
            id as string,
            status,
            user as IJWTPayload,
        );
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: 'Appointment is created successfully',
            data: result,
        });
    },
);

export const AppointmentController = {
    createAppointment,
    getMyAppointments,
    updateAppointmentStatus,
};
