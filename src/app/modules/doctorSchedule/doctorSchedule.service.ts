import {prisma} from '../../../lib/prisma';
import type {IJWTPayload} from '../../types/common';

const addDoctorSchedule = async (
    user: IJWTPayload,
    payload: {scheduleIds: string[]},
) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {email: user.email},
    });

    const doctorScheduleData = payload.scheduleIds.map((scheduleId) => ({
        doctorId: doctorData.id,
        scheduleId,
    }));

    return await prisma.doctorSchedule.createMany({data: doctorScheduleData});
};

export const DoctorScheduleService = {addDoctorSchedule};
