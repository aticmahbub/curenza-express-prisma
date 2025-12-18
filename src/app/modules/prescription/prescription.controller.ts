import type {Request, Response} from 'express';
import catchAsync from '../../utils/catchAsync';
import {PrescriptionService} from './prescription.service';
import sendResponse from '../../utils/sendResponse';
import type {IJWTPayload} from '../../types/common';

const createPrescription = catchAsync(
    async (req: Request & {user?: IJWTPayload}, res: Response) => {
        const user = req.user;
        const result = await PrescriptionService.createPrescription(
            user,
            req.body,
        );

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: 'Prescription is created successfully',
            data: result,
        });
    },
);

export const PrescriptionController = {createPrescription};
