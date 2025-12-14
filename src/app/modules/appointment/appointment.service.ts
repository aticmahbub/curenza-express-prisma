import {prisma} from '../../../lib/prisma';
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
        where: {id: payload.doctorId},
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

        return appointmentData;
    });
    return result;
};

export const AppointmentService = {createAppointment};
