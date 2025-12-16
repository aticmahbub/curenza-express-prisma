import type Stripe from 'stripe';
import {prisma} from '../../../lib/prisma';
import {PaymentStatus} from '../../../generated/enums';

const handleStripeWebhookEvent = async (event: Stripe.Event) => {
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object;

            const appointmentId = session.metadata?.appointmentId;
            const paymentId = session.metadata?.paymentId;

            await prisma.appointment.update({
                where: {id: appointmentId},
                data: {
                    paymentStatus:
                        session.payment_status === 'paid'
                            ? PaymentStatus.PAID
                            : PaymentStatus.UNPAID,
                },
            });
            await prisma.payment.update({
                where: {id: paymentId},
                data: {
                    status:
                        session.payment_status === 'paid'
                            ? PaymentStatus.PAID
                            : PaymentStatus.UNPAID,
                    paymentGatewayData: session,
                },
            });
            break;
        }
        case 'payment_intent.payment_failed': {
            const intent = event.data.object;

            // await prisma.payment.update({
            //     where: {id: paymentId},
            //     data: {
            //         status: PaymentStatus.UNPAID,
            //     },
            // });
            break;
        }

        default: {
            console.log(`Unhandled event type: ${event.type}`);
        }
    }
};

export const PaymentService = {handleStripeWebhookEvent};
