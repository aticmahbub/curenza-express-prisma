import type {NextFunction, Request, Response} from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import {stripe} from '../../../lib/stripe';
import {PaymentService} from './payment.service';
import config from '../../../config';

const handleStripeWebhookEvent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const sig = req.headers['stripe-signature'] as string;
        const webhookSecret = config.stripe.stripe_webhook_secret;

        let event;

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                webhookSecret,
            );
        } catch (error: any) {
            console.error('Webhook signature failed', error.message);
            return res.status(400).send(`Webhook error ${error.message}`);
        }

        const result = await PaymentService.handleStripeWebhookEvent(event);
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: 'User is logged in successfully',
            data: {},
        });
    },
);

export const PaymentController = {handleStripeWebhookEvent};
