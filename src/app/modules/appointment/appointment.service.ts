import config from '../../../config';
import {prisma} from '../../../lib/prisma';
import {stripe} from '../../../lib/stripe';
import type {IJWTPayload} from '../../types/common';
import {v4 as uuid} from 'uuid';
import {calculatePagination} from '../../utils/pagination';
import {
    AppointmentStatus,
    PaymentStatus,
    UserRole,
    type Prisma,
} from '../../../generated/client';
import ApiError from '../../errorHelpers/ApiError';

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

const getMyAppointments = async (user, filters, options) => {
    const {page, limit, skip, sortBy, sortOrder} = calculatePagination(options);
    const {...filterData} = filters;

    const andConditions: Prisma.AppointmentWhereInput[] = [];

    if (user.role === UserRole.PATIENT) {
        andConditions.push({
            patient: {email: user.email},
        });
    } else if (user.role === UserRole.DOCTOR) {
        andConditions.push({
            doctor: {email: user.email},
        });
    }

    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map((key) => ({
            [key]: {equals: filterData[key]},
        }));

        andConditions.push(...filterConditions);
    }

    const whereConditions: Prisma.AppointmentWhereInput =
        andConditions.length > 0 ? {AND: andConditions} : {};

    const result = await prisma.appointment.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {[sortBy]: sortOrder},

        include:
            user.role === UserRole.DOCTOR ? {patient: true} : {doctor: true},
    });

    const total = await prisma.appointment.count({where: whereConditions});

    return {meta: {total, page, limit}, data: result};
};

const updateAppointmentStatus = async (
    appointmentId: string,
    status: AppointmentStatus,
    user: IJWTPayload,
) => {
    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {id: appointmentId},
        include: {doctor: true},
    });
    console.log(user.role, appointmentData.doctor.email);

    if (user.role === UserRole.DOCTOR) {
        if (!(user.email === appointmentData.doctor.email)) {
            throw new ApiError(502, 'This is not your appointment');
        }
    }

    return await prisma.appointment.update({
        where: {id: appointmentId},
        data: {status},
    });
};

const cancelUnpaidAppointMents = async () => {
    const triggerTime = new Date(Date.now() - 30 * 60 * 1000);

    const unpaidAppointMents = await prisma.appointment.findMany({
        where: {
            createdAt: {lte: triggerTime},
            paymentStatus: PaymentStatus.UNPAID,
        },
    });

    const appointmentIdsToCancel = unpaidAppointMents.map(
        (appointment) => appointment.id,
    );

    await prisma.$transaction(async (tnx) => {
        await tnx.payment.deleteMany({
            where: {appointmentId: {in: appointmentIdsToCancel}},
        });

        await tnx.appointment.deleteMany({
            where: {id: {in: appointmentIdsToCancel}},
        });

        for (const unpaidAppointMent of unpaidAppointMents) {
            await tnx.doctorSchedule.update({
                where: {
                    doctorId_scheduleId: {
                        doctorId: unpaidAppointMent.doctorId,
                        scheduleId: unpaidAppointMent.scheduleId,
                    },
                },
                data: {isBooked: false},
            });
        }
    });
};

export const AppointmentService = {
    createAppointment,
    getMyAppointments,
    updateAppointmentStatus,
    cancelUnpaidAppointMents,
};
