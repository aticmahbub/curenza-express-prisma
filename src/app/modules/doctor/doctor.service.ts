import type {Doctor, Prisma} from '../../../generated/client';
import {prisma} from '../../../lib/prisma';
import {calculatePagination} from '../../utils/pagination';
import {doctorSearchableFields} from './doctor.constants';

const getDoctors = async (filters, options) => {
    const {page, limit, skip, sortBy, sortOrder} = calculatePagination(options);
    const {search, specialties, ...filterData} = filters;

    const andConditions: Prisma.DoctorWhereInput[] = [];

    if (search) {
        andConditions.push({
            OR: doctorSearchableFields.map((field) => ({
                [field]: {contains: search, mode: 'insensitive'},
            })),
        });
    }

    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map((key) => ({
            [key]: {equals: (filterData as any)[key]},
        }));

        andConditions.push(...filterConditions);
    }
    const whereConditions: Prisma.DoctorWhereInput =
        andConditions.length > 0 ? {AND: andConditions} : {};

    const result = await prisma.doctor.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {[sortBy]: sortOrder},
    });

    const total = await prisma.doctor.count({where: whereConditions});

    return {meta: {total, page, limit}, data: result};
};

const updateDoctor = async (id: string, payload: Partial<Doctor>) => {
    const doctorInfo = await prisma.doctor.findUniqueOrThrow({where: {id}});

    const updatedData = await prisma.doctor.update({
        where: {id: doctorInfo.id},
        data: payload,
    });

    return updatedData;
};

export const DoctorService = {getDoctors, updateDoctor};
