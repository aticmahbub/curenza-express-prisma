import type {Request, Response} from 'express';
import catchAsync from '../../utils/catchAsync';
import {ReviewService} from './review.service';
import sendResponse from '../../utils/sendResponse';
import type {IJWTPayload} from '../../types/common';

const createReview = catchAsync(
    async (req: Request & {user?: IJWTPayload}, res: Response) => {
        const user = req.user;

        const result = await ReviewService.createReview(user, req.body);

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: 'Review is created successfully',
            data: result,
        });
    },
);

export const ReviewController = {createReview};
