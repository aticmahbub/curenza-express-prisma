import type {Request, Response} from 'express';
import catchAsync from '../../utils/catchAsync';
import {pick} from '../../utils/pick';
import {patientFilterableFields} from './patient.constants';
import sendResponse from '../../utils/sendResponse';
import {PatientService} from './patient.service';
import type {IJWTPayload} from '../../types/common';

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, patientFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await PatientService.getAllFromDB(filters, options);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Patient retrieval successfully',
        meta: result.meta,
        data: result.data,
    });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const result = await PatientService.getByIdFromDB(id as string);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Patient retrieval successfully',
        data: result,
    });
});

const softDelete = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const result = await PatientService.softDelete(id as string);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Patient soft deleted successfully',
        data: result,
    });
});

const updateIntoDB = catchAsync(
    async (req: Request & {user?: IJWTPayload}, res: Response) => {
        const user = req.user;
        const result = await PatientService.updateIntoDB(
            user as IJWTPayload,
            req.body,
        );
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Patient updated successfully',
            data: result,
        });
    },
);

export const PatientController = {
    getAllFromDB,
    getByIdFromDB,
    softDelete,
    updateIntoDB,
};
