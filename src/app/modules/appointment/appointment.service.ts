import config from '../../../config';
import {prisma} from '../../../lib/prisma';
import {stripe} from '../../../lib/stripe';
import type {IJWTPayload} from '../../types/common';
import {v4 as uuid} from 'uuid';

const createAppointment = async (
    user: IJWTPayload,
    payload: {doctorId: string; scheduleId: string},
) => {
    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {email: user.email},
    });

    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {id: payload.doctorId, isDeleted: false},
    });

    const vacantSlot = await prisma.doctorSchedule.findFirstOrThrow({
        where: {
            doctorId: payload.doctorId,
            scheduleId: payload.scheduleId,
            isBooked: false,
        },
    });

    const videoCallingId = uuid();

    const result = await prisma.$transaction(async (tnx) => {
        const appointmentData = await tnx.appointment.create({
            data: {
                patientId: patientData.id,
                doctorId: doctorData.id,
                scheduleId: payload.scheduleId,
                videoCallingId,
            },
        });

        await tnx.doctorSchedule.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: doctorData.id,
                    scheduleId: payload.scheduleId,
                },
            },
            data: {isBooked: true},
        });

        const transactionId = uuid();

        const paymentData = await tnx.payment.create({
            data: {
                appointmentId: appointmentData.id,
                amount: doctorData.appointmentFee,
                transactionId,
            },
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            customer_email: user.email,
            line_items: [
                {
                    price_data: {
                        currency: 'bdt',
                        product_data: {
                            name: `Appointment with Dr. ${doctorData.name}`,
                        },
                        unit_amount: doctorData.appointmentFee * 100,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                appointmentId: appointmentData.id,
                paymentId: paymentData.id,
            },
            success_url: `${config.client_url}/payment-success`,
            cancel_url: `${config.client_url}/payment-failed`,
        });

        console.log(session.metadata);

        return {paymentUrl: session.url};
    });
    return result;
};

export const AppointmentService = {createAppointment};
