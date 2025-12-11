import {addHours, addMinutes, format} from 'date-fns';
import {prisma} from '../../../lib/prisma';
import {calculatePagination, type IOptions} from '../../utils/pagination';
import type {ScheduleWhereInput} from '../../../generated/models';
import type {Prisma} from '../../../generated/client';
import type {IJWTPayload} from '../../types/common';

const addSchedule = async (payload) => {
    const {startTime, endTime, startDate, endDate} = payload;
    const intervalTime = 30;

    const schedules = [];

    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    while (currentDate <= lastDate) {
        const startDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, 'yyyy-MM-dd')}`,
                    Number(startTime.split(':')[0]),
                ),
                Number(startTime.split(':')[1]),
            ),
        );
        const endDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, 'yyyy-MM-dd')}`,
                    Number(endTime.split(':')[0]),
                ),
                Number(endTime.split(':')[1]),
            ),
        );
        while (startDateTime < endDateTime) {
            const slotStartDateTime = startDateTime;
            const slotEndDateTime = addMinutes(startDateTime, intervalTime);

            const scheduleData = {
                startDateTime: slotStartDateTime,
                endDateTime: slotEndDateTime,
            };
            const existingSchedule = await prisma.schedule.findFirst({
                where: {
                    startDateTime: scheduleData.startDateTime,
                    endDateTime: scheduleData.endDateTime,
                },
            });

            if (!existingSchedule) {
                const result = await prisma.schedule.create({
                    data: scheduleData,
                });
                schedules.push(result);
            }
            slotStartDateTime.setMinutes(
                slotStartDateTime.getMinutes() + intervalTime,
            );
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return schedules;
};

const schedulesForDoctor = async (
    user: IJWTPayload,
    filters,
    options: IOptions,
) => {
    const {page, limit, skip, sortBy, sortOrder} = calculatePagination(options);
    const {startDateTime: filterStartDateTime, endDateTime: filterEndDateTime} =
        filters;

    const andConditions: ScheduleWhereInput[] = [];

    if (filterStartDateTime && filterEndDateTime) {
        andConditions.push({
            AND: [
                {startDateTime: {gte: filterStartDateTime}},
                {endDateTime: {lte: filterEndDateTime}},
            ],
        });
    }

    const whereConditions: Prisma.ScheduleWhereInput =
        andConditions.length > 0 ? {AND: andConditions} : {};

    const doctorSchedules = await prisma.doctorSchedule.findMany({
        where: {doctor: {email: user.email}},
        select: {scheduleId: true},
    });

    const doctorScheduleIds = doctorSchedules.map(
        (schedule) => schedule.scheduleId,
    );
    const total = await prisma.schedule.count({
        where: {...whereConditions, id: {notIn: doctorScheduleIds}},
    });

    const result = await prisma.schedule.findMany({
        where: {...whereConditions, id: {notIn: doctorScheduleIds}},
        skip,
        take: limit,
        orderBy: {[sortBy]: sortOrder},
    });

    return {meta: {page, limit, total}, data: result};
};

const deleteSchedule = async (id: string) => {
    return await prisma.schedule.delete({where: {id}});
};

export const ScheduleServices = {
    addSchedule,
    schedulesForDoctor,
    deleteSchedule,
};
