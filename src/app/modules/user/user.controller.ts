import type {Request, Response} from 'express';
import {UserService} from './user.service';
import catchAsync from '../../utils/catchAsync';

const createPatient = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createPatient(req.body);
    res.send(result);
});

export const UserController = {createPatient};
