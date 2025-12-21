import type {Request, Response} from 'express';
import catchAsync from '../../utils/catchAsync';
import {PrescriptionService} from './prescription.service';
import sendResponse from '../../utils/sendResponse';
import type {IJWTPayload} from '../../types/common';
import {pick} from '../../utils/pick';

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

const patientPrescription = catchAsync(
    async (req: Request & {user?: IJWTPayload}, res: Response) => {
        const user = req.user;
        const options = pick(req.query, [
            'page',
            'limit',
            'sortBy',
            'sortOrder',
        ]);
        const result = await PrescriptionService.patientPrescription(
            user,
            options,
        );

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: 'Prescription is retrieved successfully',
            meta: result.meta,
            data: result.data,
        });
    },
);

export const PrescriptionController = {createPrescription, patientPrescription};
