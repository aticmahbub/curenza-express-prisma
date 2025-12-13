import type {NextFunction, Request, Response} from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import {DoctorService} from './doctor.service';
import {pick} from '../../utils/pick';
import {doctorFilterableFields} from './doctor.constants';

const getDoctors = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const options = pick(req.query, [
            'page',
            'limit',
            'sortBy',
            'sortOrder',
        ]);

        const filters = pick(req.query, doctorFilterableFields);

        const result = await DoctorService.getDoctors(filters, options);

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: 'Schedules fetched  successfully',
            meta: result.meta,
            data: result.data,
        });
    },
);
const updateDoctor = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const {id} = req.params;
        const result = await DoctorService.updateDoctor(id!, req.body);

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: 'Doctor profile is updated  successfully',
            data: result,
        });
    },
);

const aiDoctorSuggestion = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = await DoctorService.aiDoctorSuggestion(req.body);

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: 'Doctor profile is updated  successfully',
            data: result,
        });
    },
);

export const DoctorController = {getDoctors, updateDoctor, aiDoctorSuggestion};
