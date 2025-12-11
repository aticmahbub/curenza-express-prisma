import type {Request, Response} from 'express';
import catchAsync from '../../utils/catchAsync';
import {SpecialtiesService} from './specialties.service';
import sendResponse from '../../utils/sendResponse';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
    const result = await SpecialtiesService.insertIntoDB(req);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Specialties created successfully!',
        data: result,
    });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const result = await SpecialtiesService.getAllFromDB();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Specialties data fetched successfully',
        data: result,
    });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const result = await SpecialtiesService.deleteFromDB(id!);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Specialty deleted successfully',
        data: result,
    });
});

export const SpecialtiesController = {
    insertIntoDB,
    getAllFromDB,
    deleteFromDB,
};
